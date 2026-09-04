import { NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse, isStaffOrAdmin } from '@/lib/rbac';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const sessionUser = await getAuthenticatedUser();
    if (!sessionUser) return unauthorizedResponse();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      // Directory already exists or created
    }

    // Generate safe filename with timestamp
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}_${cleanFileName}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save image to disk
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('Error in file upload route:', error);
    return NextResponse.json({ error: error?.message || 'Failed to upload image' }, { status: 500 });
  }
}
