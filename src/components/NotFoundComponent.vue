<template>
  <div class="not-found-container">
    <div class="error-card">
      <div class="error-visual">
        <span class="glitch-404">404</span>
      </div>

      <h1 class="error-title">Oops! Page Not Found</h1>

      <div class="actions">
        <a href="/" class="home-btn"> Back to Home </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: hsla(160, 40%, 98%, 1);
  padding: 20px;
}

.error-card {
  text-align: center;
  max-width: 450px;
  background: white;
  padding: 50px 40px;
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
  border: 1px solid hsla(160, 30%, 94%, 1);
}

.error-visual {
  position: relative;
  margin-bottom: 30px;
}

.glitch-404 {
  font-size: 100px;
  font-weight: 900;
  color: hsla(160, 100%, 37%, 0.1);
  letter-spacing: -5px;
}

.error-title {
  color: hsla(160, 40%, 15%, 1);
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 12px;
}

.home-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  padding: 16px 32px;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 10px 20px hsla(160, 100%, 37%, 0.2);
  transition: all 0.3s ease;
}

.home-btn:hover {
  background-color: hsla(160, 100%, 30%, 1);
  transform: translateY(-3px);
  box-shadow: 0 15px 30px hsla(160, 100%, 37%, 0.3);
}
</style>
