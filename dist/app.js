"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const method_override_1 = __importDefault(require("method-override"));
const web_1 = __importDefault(require("./services/routes/web"));
const api_1 = __importDefault(require("./services/routes/api"));
require("dotenv/config");
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, process.env.NODE_ENV === 'development' ? '..' : '', 'dist', 'views'));
app.use(express_1.default.static(path_1.default.join(__dirname, process.env.NODE_ENV === 'development' ? '..' : '', 'dist', "public")));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, method_override_1.default)('_method'));
app.listen(process.env.PORT||3000, () => {
    console.log("listening to port", process.env.PORT);
});
app.use("/", web_1.default);
app.use("/api", api_1.default);
