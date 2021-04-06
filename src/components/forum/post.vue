<template>
  <div>
    <div class="container-fluid gedf-wrapper">
      <div class="row">
        <div class="col-md-9 gedf-main">
          <!--- \\\\\\\Post-->
          <div class="card gedf-card"> 
            <div class="card-body">
              <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="posts" role="tabpanel" aria-labelledby="posts-tab">
                  <div class="form-group">
                    <label class="sr-only" for="message">Post</label> 
                    <textarea v-b-modal.modal-1 class="form-control" id="message" rows="3" placeholder="Start a Post..."></textarea>
                  </div> 
                </div> 
              </div> 
            </div>
          </div>
          <!-- Post /////-->  
          <post :post="post" isshowcomments="true"></post> 
        </div>
        <div class="col-md-3">
          <div class="card gedf-card">
            <div class="card-body">
              <h5 class="card-title">Subjects</h5>
              <h6 class="card-subtitle mb-2 text-muted">Filter By Subjects</h6>
              <p class="card-text"> 
                <b-list-group v-for="_subject in subjects" :key="_subject.id">
                  <b-list-group-item href="#" @click="setSubject(_subject)" :to="'/portal/social/'" class="d-flex justify-content-between align-items-center">
                    {{_subject.name}}  <i class="fas fa-check" v-if="_subject.name == subject.name"></i>
                  </b-list-group-item>
                </b-list-group>
              </p> 
            </div>
          </div> 
        </div>
      </div>
    </div>
    <b-modal id="modal-1" ref="create-modal" size="lg" hide-footer title="Create a Post">
      <createpost @close="onClosed"></createpost> 
    </b-modal>
  </div>
</template>
<script> 
  import { mapState, mapActions } from 'vuex';
  import post from 'components/forum/post/card.vue'
  import createpost from 'components/forum/post/create.vue'
  import { BIcon, BIconEnvelope, BIconCircleFill, BIconCalendar3, BIconLock, BIconPlus, BIconPerson, BIconCursorFill } from 'bootstrap-vue'
  export default {
    props: ['msg'],
    components: {
      BIcon,
      BIconEnvelope,
      BIconCircleFill,
      BIconCalendar3,
      BIconLock,
      BIconPlus,
      BIconPerson,
      BIconCursorFill,
      post,
      createpost
    }, 
    methods: {
      ...mapActions('posts', [
        'getSubjects',
        'getChannels',
        'getPost',
        'saveSubject',
        'getPostsBySubject'
      ]),
      onClosed() {
        this.$refs['create-modal'].hide()
      },
      setSubject(subject) {
        this.saveSubject(subject)
      }
    },
    mounted() { 
      var self = this;
      this.getSubjects().then(function () { 
        if (self.subject != '') {
          self.setSubject(self.subject);
        }
        else { 
          self.setSubject(self.subjects[0]);
        }
      });
    },
    computed: { 
      ...mapState({
        subjects: State => State.posts.subjects
      }),
      ...mapState({
        channels: State => State.posts.channels
      }), 
      ...mapState({
        post: state => state.posts.post
      }), 
      ...mapState({
        subject: state => state.posts.subject
      }), 
    }
  }

</script>
<style>

  .no-padding {
    padding: 4px;
    width: 24%;
  }

  .hoverClass {
    transition: 3s;
    width: 23px;
    height: 23px;
  }

  .hoverClass:hover {
    width: 15px;
    height: 15px;
  }

  .no-border:focus {
    border:none;
    outline:none;
  }


</style>
