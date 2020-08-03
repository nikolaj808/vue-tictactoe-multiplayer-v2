<template>
    <div class="chat">
        <div class="messages" id="messages" ref="messages">
            <div class="message" v-for="message in $store.state.messages">
                <p>{{ message.username }}: {{ message.message }}</p>
            </div>
        </div>
        <form class="message-form" @submit.prevent="addMessage()">
            <input v-model="text" type="text" class="message-input">
            <button type="submit" class="send-button">Send</button>
        </form>
    </div>
</template>

<script>
import store from '@/store';

export default {
    name: 'Chat',
    store,
    data() {
        return {
            text: '',
        }
    },
    mounted() {
        this.$store.state.mContainer = document.getElementById('messages');
    },
    methods: {
        addMessage() {
            this.$store.state.socket.emit('add-message', this.text, this.$route.params.id);
            this.text = '';
        }
    }
}
</script>

<style scoped>

.chat {
    flex: 1;
    border: 2px solid black;
    padding: 10px;
    border-radius: 5%;
}

.messages {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 250px;
    overflow: auto;
}

.message-form {
    display: flex;
}
</style>