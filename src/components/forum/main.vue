<template>
  <div> 
     <base-header class="pb-1 pb-1 pt-1 pt-md-6 bg-gradient-success">
      <!-- Card stats --> 
    </base-header> 
    <b-container fluid>
      <b-row>
        <b-col> 
            <channels></channels>
          </b-col>
      </b-row>
       <b-row>
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
          <div v-for="post in posts" :key="post.id">
            <post :post="post" isshowcomments="false"></post>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card gedf-card">
            <div class="card-body">
              <h5 class="card-title"></h5>
              <h6 class="card-subtitle mb-2 text-muted">Filter By Subjects</h6>
              <p class="card-text">
                <b-input-group prepend="Subject" class="mb-2 mr-sm-2 mb-sm-0">
                  <b-form-select v-model="selectedSubject" @change="onChange()" :options="subjectsList"></b-form-select>
                </b-input-group>
              </p>
            </div>
          </div>
          <b-card>
            <topics></topics>
          </b-card>
        </div>
      </b-row>
    </b-container>
    <b-modal id="modal-1" ref="create-modal" size="lg" hide-footer title="Create a Post">
      <createpost @close="onClosed"></createpost>
    </b-modal>
  </div>
</template>
<script> 
  import { mapState, mapActions } from 'vuex';
  import post from './post/card.vue'
  import topics from './topics.vue'
  import channels from './channels.vue'
  import createpost from './post/create.vue'
  import _ from 'lodash';  
  import { BIcon, BIconEnvelope, BIconCircleFill, BIconCalendar3, BIconLock, BIconPlus, BIconPerson, BIconCursorFill } from 'bootstrap-vue'
  export default {
    props: ['msg'],
    data() {
      return {
        selectedSubject: '', 
      }
    },
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
      createpost,
      topics,
      channels
    }, 
    methods: {
      ...mapActions('posts', [
        'getSubjects',
        'getChannels',
        'getPosts',
        'saveSubject',
        'getPostsBySubject',
        'getSchoolPostsBySubject'
      ]),
      onClosed() {
        this.$refs['create-modal'].hide()
      },
      setSubject(subject) {
        let self = this;
        this.saveSubject(subject); 
        //check if default view is public
        if (self.companystore.defaultView == null ||
          self.companystore.defaultView == 'Public') {
          self.getPostsBySubject(subject);
        }
        else {//if default view is school
          let payload = {
            schoolId: self.school.id,
            subjectId: subject.id
          }
          self.getSchoolPostsBySubject(payload);
        }
      }, 
      onChange() {
        let self = this; 
        var _subject = _.filter(self.subjects, function (obj) { 
          if (obj.id == self.selectedSubject) { 
            return obj;
          }
        });
        this.saveSubject(_subject[0]); 
        //check if default view is public
        if (self.companystore.defaultView == null ||
          self.companystore.defaultView == 'Public') {
          self.getPostsBySubject(self.selectedSubject);
        }
        else {//if default view is school
          let payload = {
            schoolId: self.school.id,
            subjectId: self.selectedSubject
          }
          self.getSchoolPostsBySubject(payload);
        }
      },
    },
    mounted() { 
      var self = this; 
      if (this.subjects.length == 0) {
        this.getSubjects().then(function () {
          self.selectedSubject = self.subjects[0].id;
          self.setSubject(self.subjects[0]).then(function () {
            //check if default view is public
            if (this.companystore.defaultView == 'Public') {
              self.getPostsBySubject(self.subject);
            }
            else {//if default view is school
              let payload = {
                schoolId: self.school.id,
                subjectId: self.subject.id
              }
              self.getSchoolPostsBySubject(payload);
            }
          });
        });
      }
      else {
        if (self.subject != '') {
          self.selectedSubject = self.subjects[0].id;
          self.setSubject(self.subject);
        }
      }
    },
    computed: { 
      ...mapState({
        subjects: State => State.posts.subjects
      }),
      ...mapState({
        channels: State => State.posts.channels
      }), 
      ...mapState({
        posts: state => state.posts.posts
      }), 
      ...mapState({
        subject: state => state.posts.subject
      }),
      ...mapState({
        companystore: state => state.company.company
      }),
      ...mapState({
        school: state => state.school.school
      }),
      subjectsList() {
        var _subjects = this.subjects.map(function (item) {
          return {
            value: item.id,
            text: item.name
          }
        });
        _subjects.unshift({ value: null, text: 'Please select a subject' });
        return _subjects;
      }, 
    }
  }

</script>
<style>
 


</style>
