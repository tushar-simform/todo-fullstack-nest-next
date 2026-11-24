import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoCompletion } from './todo-completion.entity.js';
import { Todo } from './todo.entity.js';
import { TodosController } from './todos.controller.js';
import { TodosService } from './todos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, TodoCompletion])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
