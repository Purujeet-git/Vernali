import connectDB from "@/lib/mongodb";
import HomeStaticImage from "@/models/HomeStaticImage";

export default async function handler(req, res) {
    await connectDB();

    if(req.method === 'POST'){
        const {key,imageUrl} = req.body;
        if(!key || !imageUrl) return res.status(400).json({error: 'Missing fields'});


        const existing = await HomeStaticImage.findOne({key});


        if(existing){
            existing.imageUrl = imageUrl;
            await existing.save();
            return res.json({message:"Image Uploaded"});
        }

        await HomeStaticImage.create({key,imageUrl});
        return res.json({message: 'Image created'});
    }

    res.status(405).json({error:"Method not allowed"});
}