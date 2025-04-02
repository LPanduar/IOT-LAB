<?php
// database/migrations/xxxx_xx_xx_create_parcelas_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('parcelas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('ubicacion');
            $table->string('responsable');
            $table->string('tipo_cultivo');
            $table->dateTime('ultimo_riego');
            $table->float('sensor_humedad');
            $table->float('sensor_temperatura');
            $table->float('lat')->nullable();
            $table->float('lng')->nullable();
            $table->timestamps();
            $table->softDeletes(); // Para mantener parcelas eliminadas
        });
    }

    public function down()
    {
        Schema::dropIfExists('parcelas');
    }
};
