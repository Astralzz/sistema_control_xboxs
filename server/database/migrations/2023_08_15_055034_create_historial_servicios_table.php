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
        Schema::create('historial_servicios', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("id_servicio");
            $table->date("fecha");
            $table->time("hora");
            $table->boolean("isTerminado")->default(false);
            $table->decimal("total", 6, 2);
            $table->string("comentario")->nullable();
            $table->timestamps();

            //Llave foránea del servicio
            $table->foreign('id_servicio')
                ->references('id')
                ->on('servicios')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_servicios');
    }
};
