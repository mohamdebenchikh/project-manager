<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->foreignId('project_id')->nullable()->constrained('projects');
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->boolean('pinned')->default(false);
            $table->enum('priority', ['low', 'medium', 'high'])->default('low');
            $table->json('labels')->nullable();
            $table->foreignId('team_id')->nullable()->constrained()->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
