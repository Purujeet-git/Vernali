import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // ensures compatibility with Vercel Blob

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'File is required' }, { status: 400 });
  }

  try {
    const blob = await put(filename, file, {
      access: 'public',          // ✅ Makes it accessible via URL
      allowOverwrite: true,      // ✅ Replace if file with same name exists
    });

    return NextResponse.json({ url: blob.url }, { status: 200 });
  } catch (error) {
    // console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', message: error.message },
      { status: 500 }
    );
  }
}
