<template>
  <div class="about">
    <div>
      <Game />
    </div>
    <div>
      <Chat />
    </div>
  </div>
</template>

<script>
import Game from '../components/Game';
import Chat from '../components/Chat';

export default {
  name: 'About',
  components: {
    Game,
    Chat
  }
}
</script>

<style scoped>
.about {
  display: flex;
  height: 90%;
  justify-content: space-evenly;
  align-items: center;
}
</style>