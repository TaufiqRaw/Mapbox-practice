import {Router} from 'express';
import catchAsync from '../../util/catchAsync';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import 'dotenv/config'
import mapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const geocoder = mapboxGeocoding({accessToken: <string>process.env.MAPBOX_TOKEN});
const router = Router();

const prisma = new PrismaClient();

router.get("/map",catchAsync(async (req,res)=>{
    const {q} = req.query;
    if(!q)
        return res.status(400).send("bad request");
    const geoData = await geocoder.forwardGeocode({
        query: <string> q,
        limit: 5,
    }).send()
    res.send(geoData.body.features)
}))

router.get("/markers", catchAsync(async(req,res)=>{
    const markers = await prisma.marker.findMany();
    res.send(markers);
}))
router.post("/markers", catchAsync(async(req,res)=>{
    const {marker} = req.body;
    const newMarker = await prisma.marker.create({data: marker});
    res.send(newMarker);
}))
router.delete("/markers/:id", catchAsync(async(req,res)=>{
    const id = parseInt(req.params.id);
    const newMarker = await prisma.marker.delete({where:{id:id}});
    res.send(newMarker);
}))

export default router;