<template>
    <div class="user-pathway-add-form">
        <input
            type="text"
            v-model="title"
            placeholder="Enter Pathway Name"
        />
        <textarea
            v-model="geneList"
            v-bind:placeholder="placeholder"
        >
        </textarea>
        <button class="button is-primary"
           v-on:click="addPathway"
        >
            Add Pathway
        </button>
    </div>
</template>

<script>
export default {
    name: 'user-pathway-add-form',
    data() {
        return {
            placeholder: 'Enter Pathway Genes Separated by New Lines\nGene1\nGene2',
            title: '',
            geneList: ''
        }
    },
    methods: {
        addPathway() {
            let userPathways = Object.assign({}, this.$store.state.userPathways);
            let snakeCaseTitle = this.title.toLowerCase().split(' ').join("_");

            userPathways[snakeCaseTitle] = {
                color: "#000000",
                displayName: this.title,
                genes: this.geneList.split("\n")
            };

            this.$store.dispatch('updateUserPathways', userPathways);

            this.$ls.set('userPathways', JSON.stringify(userPathways));

            let displayData = {
              pathways: {},
              add: true
            };
            displayData['pathways'][snakeCaseTitle] = this.title;

            this.$store.dispatch(
                'updateUserPathwayDisplay',
                displayData
            );

            this.$modal.hide('add-user-pathway')
        }
    }
}
</script>

<style>
    .user-pathway-add-form {
        display: flex;
        flex-direction: column;
        /*height: 100%;*/
    }

    .user-pathway-add-form textarea {
        background-color: pink;
        height: 150px;
        width: 85%;
        margin: 8px auto;
    }
</style>