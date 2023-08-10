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
        Schema::create('rentas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("id_xbox");
            $table->date("fecha");
            $table->time("inicio");
            $table->time("final")->nullable();
            $table->decimal("duracion", 6, 2)->nullable();
            $table->decimal("total", 6, 2)->default(0);
            $table->integer("noControles")->default(1);
            $table->boolean("isPagado")->default(false);
            $table->string("cliente")->nullable();
            $table->text("comentario")->nullable();
            $table->timestamps();

            //Llave foránea del xbox
            $table->foreign('id_xbox')
                ->references('id')
                ->on('xboxs')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentas');
    }
};
