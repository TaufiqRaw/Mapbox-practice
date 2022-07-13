"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = __importDefault(require("../../util/catchAsync"));
const client_1 = require("@prisma/client");
require("dotenv/config");
const geocoding_1 = __importDefault(require("@mapbox/mapbox-sdk/services/geocoding"));
const geocoder = (0, geocoding_1.default)({ accessToken: process.env.MAPBOX_TOKEN });
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/map", (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    if (!q)
        return res.status(400).send("bad request");
    const geoData = yield geocoder.forwardGeocode({
        query: q,
        limit: 5,
    }).send();
    res.send(geoData.body.features);
})));
router.get("/markers", (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const markers = yield prisma.marker.findMany();
    res.send(markers);
})));
router.post("/markers", (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { marker } = req.body;
    const newMarker = yield prisma.marker.create({ data: marker });
    res.send(newMarker);
})));
router.delete("/markers/:id", (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const newMarker = yield prisma.marker.delete({ where: { id: id } });
    res.send(newMarker);
})));
exports.default = router;
