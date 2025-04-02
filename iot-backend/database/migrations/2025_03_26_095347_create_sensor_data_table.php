<?php
// database/migrations/xxxx_xx_xx_create_sensor_data_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sensor_data', function (Blueprint $table) {
            $table->id();
            $table->float('temperatura');
            $table->float('humedad');
            $table->float('lluvia');
            $table->float('sol');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sensor_data');
    }
};
