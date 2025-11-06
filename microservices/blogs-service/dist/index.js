"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = __importDefault(require("./utils/prisma"));
const blogs_router_1 = __importDefault(require("./routes/blogs.router"));
const rate_limter_1 = __importDefault(require("./utils/rate-limter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(rate_limter_1.default);
// health
app.get("/health", (req, res) => res.json({ ok: true }));
// routes
app.use("/blogs", blogs_router_1.default);
// global error handler (simple)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Internal server error" });
});
const PORT = process.env.PORT || 4000;
async function main() {
    await prisma_1.default.$connect();
    app.listen(PORT, () => {
        console.log(`Blogs service listening on ${PORT}`);
    });
}
main().catch((e) => {
    console.error(e);
    prisma_1.default.$disconnect();
    process.exit(1);
});
