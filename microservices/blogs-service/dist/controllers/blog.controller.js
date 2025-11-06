"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getAllBlogs = exports.getBlog = exports.createBlog = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const cloudinary_1 = require("../utils/cloudinary");
/**
 Create blog
 expects req.user.email from auth middleware
 optional req.file (multer memory)
 */
const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const authorEmail = req.user?.email;
        let heroUrl = undefined;
        let heroPublicId = undefined;
        if (req.file && req.file.buffer) {
            const r = await (0, cloudinary_1.uploadBuffer)(req.file.buffer, "blogs");
            heroUrl = r.secure_url;
            heroPublicId = r.public_id;
        }
        const blog = await prisma_1.default.blog.create({
            data: {
                userid: authorEmail,
                title,
                content,
                heroUrl,
                heroPublicId
            }
        });
        res.status(201).json(blog);
    }
    catch (err) {
        console.error(err);
        if (err.code === "P2002") {
            return res.status(409).json({ message: "Slug already exists" });
        }
        res.status(500).json({ message: "Internal server error", details: err.message });
    }
};
exports.createBlog = createBlog;
const getBlog = async (req, res) => {
    try {
        const blog = await prisma_1.default.blog.findUnique({ where: { id: Number(req.params.id) } });
        if (!blog)
            return res.status(404).json({ message: "Not found" });
        res.json(blog);
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error", details: err.message });
    }
};
exports.getBlog = getBlog;
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await prisma_1.default.blog.findMany({ orderBy: { createdAt: "desc" } });
        res.json(blogs);
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error", details: err.message });
    }
};
exports.getAllBlogs = getAllBlogs;
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const parsedid = Number(id);
        const existing = await prisma_1.default.blog.findUnique({ where: { id: parsedid } });
        if (!existing)
            return res.status(404).json({ message: "Not found" });
        // Optional: enforce ownership (only author can edit)
        if (existing.userid !== req.user?.email) {
            return res.status(403).json({ message: "Forbidden: not the blog author" });
        }
        let heroUrl = existing.heroUrl;
        let heroPublicId = existing.heroPublicId;
        if (req.file && req.file.buffer) {
            if (heroPublicId) {
                await (0, cloudinary_1.deleteByPublicId)(heroPublicId);
            }
            const r = await (0, cloudinary_1.uploadBuffer)(req.file.buffer, "blogs");
            heroUrl = r.secure_url;
            heroPublicId = r.public_id;
        }
        const updated = await prisma_1.default.blog.update({
            where: { id: parsedid },
            data: {
                title: req.body.title ?? existing.title,
                content: req.body.content ?? existing.content,
                heroUrl,
                heroPublicId
            }
        });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        if (err.code === "P2002")
            return res.status(409).json({ message: "Slug already exists" });
        res.status(500).json({ message: "Internal server error", details: err.message });
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const parsedid = Number(id);
        const existing = await prisma_1.default.blog.findUnique({ where: { id: parsedid } });
        if (!existing)
            return res.status(404).json({ message: "Not found" });
        // ownership check
        if (existing.userid !== req.user?.email) {
            return res.status(403).json({ message: "Forbidden: not the blog author" });
        }
        if (existing.heroPublicId) {
            await (0, cloudinary_1.deleteByPublicId)(existing.heroPublicId);
        }
        await prisma_1.default.blog.delete({ where: { id: parsedid } });
        res.json({ message: "Deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error", details: err.message });
    }
};
exports.deleteBlog = deleteBlog;
