import { TodosAccess } from '../dataLayer/todosAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic

const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils();
const todosAccess = new TodosAccess()

// Get todo function
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Get todos for user function called !')
    return todosAccess.getAllTodos(userId);
}

// Create todo function
export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    logger.info('Create todo function called !')

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: s3AttachmentUrl,
        ...newTodo
    }

    return await todosAccess.createTodoItem(newItem)
}

// Update todo function
export async function updateTodo(
    todoId: string,
    todoUpdate: UpdateTodoRequest,
    userId: string
): Promise<TodoUpdate> {
    logger.info('Update todo function called')
    return await todosAccess.updateTodoItem(todoId, userId, todoUpdate)
}

// Delete todo function
export async function deleteTodo(
    todoId: string,
    userId: string
): Promise<string> {
    logger.info('Delete todo function called')
    return todosAccess.deleteTodoItem(todoId, userId)
}

// create attachment function
export async function createAttachmentPresignedUrl(
    todoId: string,
    userId: string
): Promise<string> {
    logger.info('Create attachment function called by user', userId, todoId)
    return attachmentUtils.getUploadUrl(todoId)
}