<template>
    <div class="game">
        <div class="turn">
            <h3 v-if="!$store.state.game.playing && $store.state.game.winner != ''">{{ $store.state.game.winner }} wins!</h3>
            <h3 v-if="!$store.state.game.playing && $store.state.game.winner == ''">Game hasn't started</h3>
            <h3 v-if="$store.state.game.playing">{{ $store.state.game.currentPlayer }}'s turn</h3>
        </div>
        <Board />
    </div>
</template>

<script>
import Board from './Board';
import store from '@/store';

export default {
    name: 'Game',
    store,
    components: {
        Board
    }
}
</script>

<style scoped>
.turn {
    text-align: center;
}

.game {
    flex: 2;
    padding: 10px;
}
</style>