<template>
  <div>
    <nav style="display:flex; gap:12px; padding:12px; border-bottom:1px solid #ddd;">
      <RouterLink to="/dashboard">Dashboard</RouterLink>
      <RouterLink to="/projects">Projects</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
    </nav>

    <RouterView />
  </div>
</template>
