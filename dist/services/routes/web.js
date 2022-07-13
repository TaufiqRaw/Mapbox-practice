"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = __importDefault(require("../../util/catchAsync"));
const router = (0, express_1.Router)();
router.get("/", (0, catchAsync_1.default)((req, res) => {
    res.render("index");
}));
exports.default = router;
