import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { TODO_COMPLETIONS_ROUTE, TODOS_ROUTE } from '../constants/index.js';
import {
  createTodoSchema,
  occurrenceDateSchema,
  todoIdSchema,
  updateTodoSchema,
  type CreateTodoDto,
  type UpdateTodoDto,
} from './todo.schema.js';
import { TodosService, type TodoResponse } from './todos.service.js';

/** Every route requires a signed-in user and only touches that user's todos. */
@Controller(TODOS_ROUTE)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body({ schema: createTodoSchema }) dto: CreateTodoDto,
  ): Promise<TodoResponse> {
    return this.todosService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string): Promise<TodoResponse[]> {
    return this.todosService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id', { schema: todoIdSchema }) id: string,
  ): Promise<TodoResponse> {
    return this.todosService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id', { schema: todoIdSchema }) id: string,
    @Body({ schema: updateTodoSchema }) dto: UpdateTodoDto,
  ): Promise<TodoResponse> {
    return this.todosService.update(userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', { schema: todoIdSchema }) id: string,
  ): Promise<void> {
    return this.todosService.remove(userId, id);
  }

  @Put(TODO_COMPLETIONS_ROUTE)
  complete(
    @CurrentUser('id') userId: string,
    @Param('id', { schema: todoIdSchema }) id: string,
    @Param('date', { schema: occurrenceDateSchema }) date: string,
  ): Promise<TodoResponse> {
    return this.todosService.setCompletion(userId, id, date, true);
  }

  @Delete(TODO_COMPLETIONS_ROUTE)
  uncomplete(
    @CurrentUser('id') userId: string,
    @Param('id', { schema: todoIdSchema }) id: string,
    @Param('date', { schema: occurrenceDateSchema }) date: string,
  ): Promise<TodoResponse> {
    return this.todosService.setCompletion(userId, id, date, false);
  }
}
