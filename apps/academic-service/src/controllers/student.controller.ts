import { Router } from "express";
import * as studentService from "../services/student.service";
import { authenticate, requireRole } from "@ilm/auth-kit";
import { validateBody } from "@ilm/http-kit";
import { CreateStudentDto } from "../dtos/student/CreateStudentDto";

export const studentRouter = Router();

const DEFAULT_PAG_SIZE = 10;
const MAX_PAGE_SIZE = 100;

studentRouter.get("/", requireRole("admin", "teacher"), async (req, res) => {
    const page = Math.max(1, Number(req.query.current) || 1);
    const pageSize = Math.min(Number(req.query.pageSize) || DEFAULT_PAG_SIZE, MAX_PAGE_SIZE);

    const students = await studentService.listStudents(page, pageSize);
    res.json(students);
});

studentRouter.post("/", requireRole("admin", "teacher"), validateBody(CreateStudentDto), async (req, res) => {
    const dto = req.body as CreateStudentDto;

    const student = await studentService.createStudent(dto, req.user!);
    req.log.info({ studentId: student.id, by: req.user!.sub }, "student created");
    res.status(201).json(student);
});

studentRouter.put("/:id", requireRole("admin", "teacher"), validateBody(CreateStudentDto), async (req, res) => {
    const studentId = req.params.id;
    const dto = req.body as CreateStudentDto;

    const student = await studentService.updateStudent(studentId, dto, req.user!);
    req.log.info({ studentId: student.id, by: req.user!.sub }, "student updated");
    res.json(student);
});

studentRouter.delete("/:id", requireRole("admin", "teacher"), async (req, res) => {
    const studentId = req.params.id;

    await studentService.deleteStudent(studentId);
    req.log.info({ studentId, by: req.user!.sub }, "student deleted");
    res.status(204).send();
});