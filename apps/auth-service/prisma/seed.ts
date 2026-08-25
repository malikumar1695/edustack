import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/utils/password";


const ROLE_NAMES = ["admin", "teacher", "student", "parents"];

type RoleName = (typeof ROLE_NAMES)[number];

const RESOURCES = ["course", "student", "user", "grade", "attendance", "report"] as const;
const ACTIONS = ["create", "read", "update", "delete"] as const;

const ALL_PERMISSIONS = RESOURCES.flatMap((resource) =>
    ACTIONS.map((action) => ({
        resource,
        action,
        name: `${resource}:${action}`,
    })),
);

const ROLE_PERMISSIONS: Record<RoleName, string[]> = {
    admin: ALL_PERMISSIONS.map(p => p.name),
    teacher: ALL_PERMISSIONS.filter(p => ["course", "student", "grade", "attendance"].includes(p.resource)).map(p => p.name),
    student: ALL_PERMISSIONS.filter(p => ["course", "grade", "attendance"].includes(p.resource) && p.action === "read").map(p => p.name),
    parents: ALL_PERMISSIONS.filter(p => ["report", "attendance", "grade"].includes(p.resource) && p.action === "read").map(p => p.name),
};


const main = async () => {
    const roleIdByName = new Map<string, string>();

    for (const roleName of ROLE_NAMES) {
        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
        });
        roleIdByName.set(roleName, role.id);
    }

    const permissionIdByName = new Map<string, string>();
    for (const permission of ALL_PERMISSIONS) {
        const created = await prisma.permission.upsert({
            where: { name: permission.name },
            update: {},
            create: permission,
        });
        permissionIdByName.set(created.name, created.id);
    }

    for (const roleName of ROLE_NAMES) {
        const roleId = roleIdByName.get(roleName)!;
        for (const permissionName of ROLE_PERMISSIONS[roleName]) {
            const permissionId = permissionIdByName.get(permissionName);
            if (!permissionId) {
                throw new Error(`Unknown permission "${permissionName}" for role "${roleName}"`);
            }

            await prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId, permissionId } },
                update: {},
                create: { roleId, permissionId },
            });
        }
    }

    console.log(`Seeded ${ROLE_NAMES.length} roles and ${ALL_PERMISSIONS.length} permissions.`);

    const adminUser = await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            passwordHash: await hashPassword("admin"),
        },
    });

    const adminRoleId = roleIdByName.get("admin")!;
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: adminUser.id, roleId: adminRoleId } },
        update: {},
        create: { userId: adminUser.id, roleId: adminRoleId },
    });

    console.log(`Seeded admin user "${adminUser.username}".`);
};

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
