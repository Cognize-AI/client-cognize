import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
	try {
		const { image } = await request.json();

		const uploadResponse = await cloudinary.uploader.upload(image, {
			folder: "my-project-folder",
			resource_type: "image",
		});

		return NextResponse.json({
			url: uploadResponse.secure_url,
			public_id: uploadResponse.public_id,
		});
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Upload failed" }, { status: 500 });
	}
}
