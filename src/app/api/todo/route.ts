import { NextResponse } from "next/server";
import { getTodos, addTodo, updateTodo, deleteTodo } from "@/lib/todo";

// GET /api/todo
export async function GET() {
    const todos = await getTodos();
    return NextResponse.json(todos);
}

// POST /api/todo
export async function POST(request: Request) {
    try {
        const { title, dueDate, tags } = await request.json();
        
        if (typeof title !== "string" || !title.trim()) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }
        
        if (dueDate && isNaN(Date.parse(dueDate))) {
            return NextResponse.json(
                { error: "dueDate must be a valid date if provided" },
                { status: 400 }
            );
        }
        
        if (!Array.isArray(tags)) {
            return NextResponse.json(
                { error: "Tags must be an array" },
                { status: 400 }
            );
        }
        
        const todo = await addTodo(
            title,
            tags,
            dueDate ? new Date(dueDate) : undefined
        );
        
        return NextResponse.json(todo, { status: 201 });
    } catch (reason) {
        const message =
            reason instanceof Error ? reason.message : "Unexpected error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// PATCH /api/todo?id=1
export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    
    if (!id) {
        return NextResponse.json(
            { error: "ID is required" },
            { status: 400 }
        );
    }
    
    const updates = await request.json();
    const todo = await updateTodo(id, updates);
    
    if (!todo) {
        return NextResponse.json(
            { error: "Todo not found" },
            { status: 404 }
        );
    }
    
    return NextResponse.json(todo);
}

// DELETE /api/todo?id=1
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    
    if (!id) {
        return NextResponse.json(
            { error: "ID is required" },
            { status: 400 }
        );
    }
    
    const success = await deleteTodo(id);
    
    if (!success) {
        return NextResponse.json(
            { error: "Todo not found" },
            { status: 404 }
        );
    }
    
    return NextResponse.json({ success: true });
}
