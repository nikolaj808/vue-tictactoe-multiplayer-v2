<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import store from '@/store'

export default {
  store,
  mounted() {
    // Setup socket handlers for emits from server

    // Error
    this.$store.state.socket.on('error-page', () => {
      this.$router.push({ path: '/error' });
    });

    // Room created successfully - navigate to the room
    this.$store.state.socket.on('created', name => {
      this.$store.state.navigated += 1;
      this.$router.push({ path: '/room/' + name });
    });

    // Room joined successfully - navigate to the room
    this.$store.state.socket.on('joined', name => {
      this.$store.state.navigated += 1;
      this.$router.push({ path: '/room/' + name });
    });

    // Chat messages in room has been updated. Update messages client-side and scroll to bottom of chat.
    this.$store.state.socket.on('chat-messages', messages => {
      this.$store.state.messages = messages;
      this.$nextTick(() => {
        this.$store.state.mContainer.scrollTop = this.$store.state.mContainer.scrollHeight - this.$store.state.mContainer.clientHeight;
      });
    });

    // Users in room has been updated. Update users client-side.
    this.$store.state.socket.on('room-users', users => {
      this.$store.state.users = users;
    });

    // Game in room has been updated. Update game client-side
    this.$store.state.socket.on('game', game => {
      this.$store.state.game = game;
    });

    // Gets available rooms and updates whenever a new one is created, filled or closed.
    this.$store.state.socket.on('availableRooms', availableRooms => {
      this.$store.state.availableRooms = availableRooms;
    });

    this.$store.state.socket.on('missing-username', () => {
      let username = prompt('Enter your username:', '');
      this.$store.state.socket.emit('join-room', this.$route.params.id, username);
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  height: 100vh;
}

body {
  background-image: linear-gradient(to bottom right, red, yellow);
  background-size: 100%;
  margin: 0;
  padding: 0;
}

.button-secondary {
    background: lightgray;
  }
</style>
