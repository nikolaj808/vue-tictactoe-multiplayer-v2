<template>
  <div class="home">
    <div class="welcome">
      <h1>Tic Tac Toe multiplayer</h1>
    </div>
    <div class="main-container">
      <div class="room-handling">
        <h5>Room name</h5>
        <input v-model="id" type="text" placeholder="Enter a room name..">
        <button class="button-primary" @click.prevent="createRoom">Create room</button>
        <button class="button-secondary" @click.prevent="joinRoom">Join room</button>
      </div>
      <div class="rooms-list">
        <h5>Rooms</h5>
        <div class="room-entry" v-for="room in $store.state.availableRooms" :key="room.name">
          <div class="room-entry-button">
            <button @click="joinRoomFromList(room.name)">Join</button>
          </div>
          <div class="room-entry-room">
            <p>{{ room.name }}</p>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      id: null,
      username: ''
    }
  },
  methods: {
    createRoom() {
      this.username = prompt('Enter your username:', '');
      this.$store.state.socket.emit('create-room', this.id, this.username);
    },
    joinRoom() {
      this.username = prompt('Enter your username:', '');
      this.$store.state.socket.emit('join-room', this.id, this.username);
    },
    joinRoomFromList(name) {
      this.username = prompt('Enter your username:', '');
      this.$store.state.socket.emit('join-room', name, this.username);
    }
  }
}
</script>

<style scoped>
  .home {
    height: 100%;
  }

  .welcome {
    display: flex;
    justify-content: center;
    transform: translateY(30%);
    color: lightgreen;
  }

  .main-container {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 70%;
  }

  .room-handling {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 70%;
  }

  .rooms-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 300px;
    width: 200px;
    overflow: auto;
    border: 2px solid black;
  }

  .room-entry {
    display: flex;
    align-items: baseline;
    margin: 5px;
  }

  .room-entry-room {
    margin-left: 10px;
  }
</style>