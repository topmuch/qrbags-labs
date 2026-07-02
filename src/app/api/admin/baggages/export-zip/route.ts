import { NextRequest, NextResponse } from 'next/server';
import { ZipArchive } from 'archiver';
import { PassThrough } from 'stream';
import { db } from '@/lib/db';
import {
  generateQRCodeImagesForBaggages,
  formatPassengerFolderName,
} from '@/lib/qr-server';

/**
 * POST /api/admin/baggages/export-zip
 *
 * Export QR codes as a ZIP file organized by passenger.
 * Each passenger gets a folder containing their 3 QR code PNG images.
 *
 * Body:
 *   - agencyId: string (required) - Filter by agency
 *   - type: 'hajj' | 'voyageur' (optional) - Filter by type
 *   - setId: string (optional) - Export a specific set only
 *   - setIds: string[] (optional) - Export multiple specific sets
 *   - status: string (optional) - Filter by status
 *
 * Response: ZIP file stream
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agencyId, type, setId, setIds, status } = body;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (agencyId && agencyId !== '__all__') {
      where.agencyId = agencyId;
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    // Filter by specific set(s)
    if (setId) {
      where.setId = setId;
    } else if (setIds && Array.isArray(setIds) && setIds.length > 0) {
      where.setId = { in: setIds };
    }

    // If no filter at all, reject to prevent accidental massive exports
    if (!agencyId && !setId && (!setIds || setIds.length === 0)) {
      return NextResponse.json(
        { error: 'Veuillez spécifier au moins un filtre (agencyId, setId, ou setIds)' },
        { status: 400 }
      );
    }

    // Fetch baggages
    const baggages = await db.baggage.findMany({
      where,
      include: { agency: true },
      orderBy: [{ setId: 'asc' }, { baggageIndex: 'asc' }],
    });

    if (baggages.length === 0) {
      return NextResponse.json(
        { error: 'Aucun baggage trouvé avec ces critères' },
        { status: 404 }
      );
    }

    // Get base URL from request
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    // Generate QR code images grouped by passenger (setId)
    const groupedImages = await generateQRCodeImagesForBaggages(
      baggages.map((b) => ({
        reference: b.reference,
        type: b.type,
        setId: b.setId,
        baggageIndex: b.baggageIndex,
        baggageType: b.baggageType,
        travelerFirstName: b.travelerFirstName,
        travelerLastName: b.travelerLastName,
      })),
      baseUrl,
    );

    // Build a map of setId -> traveler info for folder naming
    const travelerInfoMap = new Map<string, { firstName: string | null; lastName: string | null }>();
    for (const baggage of baggages) {
      const key = baggage.setId || baggage.reference.split('-')[0];
      if (!travelerInfoMap.has(key)) {
        travelerInfoMap.set(key, {
          firstName: baggage.travelerFirstName,
          lastName: baggage.travelerLastName,
        });
      }
    }

    // Sort setIds for consistent ordering
    const sortedSetIds = Array.from(groupedImages.keys()).sort();

    // Create ZIP archive using archiver v8 API
    const passThrough = new PassThrough();
    const archive = new ZipArchive({
      zlib: { level: 6 },
    });

    // Pipe archive to passthrough
    archive.pipe(passThrough);

    // Add each passenger's QR codes to the archive
    sortedSetIds.forEach((currentSetId, index) => {
      const images = groupedImages.get(currentSetId)!;
      const travelerInfo = travelerInfoMap.get(currentSetId);

      const folderName = formatPassengerFolderName(
        index,
        currentSetId,
        travelerInfo?.firstName,
        travelerInfo?.lastName,
      );

      // Add each QR code image to the passenger's folder
      for (const image of images) {
        archive.append(image.buffer, {
          name: `${folderName}/${image.filename}`,
        });
      }

      // Add a README text file in each passenger folder
      const readmeContent = generatePassengerReadme(
        currentSetId,
        images,
        travelerInfo?.firstName,
        travelerInfo?.lastName,
      );
      archive.append(readmeContent, {
        name: `${folderName}/README.txt`,
      });
    });

    // Add a global manifest file
    const manifestContent = generateManifest(baggages, sortedSetIds, travelerInfoMap);
    archive.append(manifestContent, { name: '_MANIFEST.txt' });

    // Finalize the archive
    await archive.finalize();

    // Convert stream to buffer for Next.js response
    const chunks: Uint8Array[] = [];
    for await (const chunk of passThrough) {
      chunks.push(chunk as Uint8Array);
    }
    const zipBuffer = Buffer.concat(chunks);

    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 10);
    const agencyName = baggages[0]?.agency?.name || 'export';
    const baggageType = type || 'all';
    const zipFilename = `QRBag-${agencyName}-${baggageType}-${baggages.length}QR-${timestamp}.zip`;

    // Return ZIP file
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(zipFilename)}"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('[EXPORT-ZIP] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'export ZIP', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Generate a README.txt for each passenger folder
 */
function generatePassengerReadme(
  setId: string,
  images: Array<{ reference: string; baggageIndex: number; baggageType: string; filename: string }>,
  firstName?: string | null,
  lastName?: string | null,
): string {
  const lines: string[] = [
    '===================================',
    '  QRBag - QR Codes Bagage',
    '===================================',
    '',
    `Set ID    : ${setId}`,
    `Passager  : ${firstName || 'En attente d\'activation'} ${lastName || ''}`.trim(),
    `Date      : ${new Date().toLocaleDateString('fr-FR')}`,
    '',
    '--- QR Codes ---',
    '',
  ];

  for (const img of images) {
    const typeLabel = img.baggageType === 'cabine' ? 'Bagage cabine' : 'Bagage soute';
    lines.push(`  ${typeLabel} #${img.baggageIndex}: ${img.reference}`);
  }

  lines.push('');
  lines.push('--- Instructions ---');
  lines.push('');
  lines.push('1. Imprimez chaque QR code sur une etiquette.');
  lines.push('2. Collez chaque etiquette sur le bagage correspondant.');
  lines.push('3. Le voyageur active ses QR codes sur qrbags.com/activate');
  lines.push('4. Si un bagage est perdu, le trouveur scanne le QR code');
  lines.push('   et le proprietaire recoit une notification WhatsApp.');
  lines.push('');
  lines.push('QRBag - Protegez vos bagages, en toute serenite.');

  return lines.join('\n');
}

/**
 * Generate a global manifest for the ZIP
 */
function generateManifest(
  baggages: Array<{
    reference: string;
    type: string;
    setId: string | null;
    baggageIndex: number;
    baggageType: string;
    travelerFirstName: string | null;
    travelerLastName: string | null;
    status: string;
    createdAt: Date;
  }>,
  sortedSetIds: string[],
  travelerInfoMap: Map<string, { firstName: string | null; lastName: string | null }>,
): string {
  const lines: string[] = [
    '===================================',
    '  QRBag - Export Manifest',
    '===================================',
    '',
    `Date d'export    : ${new Date().toLocaleString('fr-FR')}`,
    `Total QR codes   : ${baggages.length}`,
    `Total passagers  : ${sortedSetIds.length}`,
    `Type             : ${baggages[0]?.type === 'hajj' ? 'Hajj' : 'Voyageur'}`,
    '',
    '--- Liste des passagers ---',
    '',
  ];

  sortedSetIds.forEach((currentSetId, index) => {
    const info = travelerInfoMap.get(currentSetId);
    const paddedIndex = String(index + 1).padStart(3, '0');
    const name = info?.firstName && info?.lastName
      ? `${info.firstName} ${info.lastName}`
      : 'En attente d\'activation';
    lines.push(`  ${paddedIndex}. ${currentSetId} - ${name}`);
  });

  lines.push('');
  lines.push('--- Details complets ---');
  lines.push('');

  for (const baggage of baggages) {
    lines.push(
      `${baggage.reference} | Set: ${baggage.setId || 'N/A'} | ` +
      `Type: ${baggage.baggageType} #${baggage.baggageIndex} | ` +
      `Statut: ${baggage.status} | ` +
      `Passager: ${baggage.travelerFirstName || '-'} ${baggage.travelerLastName || ''}`,
    );
  }

  return lines.join('\n');
}
