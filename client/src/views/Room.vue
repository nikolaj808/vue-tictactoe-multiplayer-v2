<template>
  <div class="room">
    <div class="main">
      <div>
        <Game />
      </div>
      <div class="users">
        <h3>Users:</h3>
        <h5 v-for="user in $store.state.users" :key="user.player">{{ user.username }} - {{ user.player }}</h5>
      </div>
      <div>
        <Chat />
      </div>
    </div>
    <div class="back">
      <button @click.prevent="back" class="button-secondary">Leave</button>
    </div>
  </div>
</template>

<script>
import store from '@/store';
import Game from '../components/Game';
import Chat from '../components/Chat';

export default {
  store,
  components: {
    Game,
    Chat
  },
  methods: {
    back() {
      this.$store.state.socket.emit('leave-room', this.$route.params.id);
      this.$router.push({ path: '/' });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$store.state.navigated == 1) {
        vm.$store.state.navigated -= 1;
        next();
      }
      else {
        next(false);
        vm.$router.push({ path: '/error' });
      }
    });
  }
}
</script>

<style scoped>
.room {
  height: 100%;
}

.main {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.users {
  justify-self: flex-start;
  align-self: flex-start;
  padding: 10px;
}

.back {
  text-align: center;
}
</style>