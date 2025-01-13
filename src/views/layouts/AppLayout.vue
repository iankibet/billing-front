<script setup>

</script>

<template>
  <div class="pagetitle">
    <h1 class="system-title">
      <slot name="title"></slot>
    </h1>
    <nav class="d-none">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="index.html">Home</a></li>
        <li class="breadcrumb-item">Pages</li>
        <li class="breadcrumb-item active">Blank</li>
      </ol>
    </nav>
  </div><!-- End Page Title -->
  <slot name="body"/>
</template>
