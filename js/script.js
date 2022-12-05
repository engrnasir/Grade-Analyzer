const app = Vue.createApp({});

app.component('home', {
    data() {
      return ({
        coursename:'',
        grade:0,
        editIndex:0,

        searchKey:'',

        showCreatePopup:false,
        showEditPopup:false,

        honorGradesOn:false,
        failGradesOn:false,

        courses:[
            {name:'Computer', grade:10},
            {name:'Math', grade:30},
            {name:'MEath', grade:90},
        ],
        filteredCourses:[],
        honorGradesBackup:[],
        failGradesBackup:[]

      });
    },
    methods:{
        addToList(course){
            let index = -1;
            index = this.courses.findIndex((el)=>{
                return el.name.toLowerCase() === course.name.toLowerCase()
            })
            if(index>-1){
                alert('Error : Course found already')
            }else{
                this.courses.push(course)
                alert('Added to list...')
                this.showCreatePopup=false;
                this.coursename=''
                this.grade=0
            }
        },
        removeCourse(index){
            if(confirm('Are you sure to delete?')){
                let course = this.filteredCourses[index]
                let i = this.courses.findIndex((el)=>{
                    return el === course
                })
                this.courses.splice(i,1)
                this.filteredCourses.splice(index,1)

            }
        },
        setupForEdit(index){
            this.coursename=this.courses[index].name
            this.grade=this.courses[index].grade
            this.editIndex=index
            this.showEditPopup = true
        },
        updateCourse(){
            let i=-1;
            this.courses.forEach((el,index)=>{
                if(index!==this.editIndex  && el.name.toLowerCase() === this.coursename.toLowerCase()){
                    i = index
                }
            })
            if(i>-1){
                alert('The updated course exist already')
            }else{
                this.courses[this.editIndex].name = this.coursename
                this.courses[this.editIndex].grade = this.grade
                this.showEditPopup = false
                alert('Updated Successfully!')
                this.coursename=''
                this.grade = 0
            }
        },
        searchCourse(){
            this.filteredCourses = this.courses.filter((el)=>{
                return el.name.toLowerCase().includes(this.searchKey.toLowerCase())
            })
            this.honorGradesBackup = [...this.filteredCourses]
            this.failGradesBackup = [...this.filteredCourses]
        },
        sortAsscending(){
           this.filteredCourses =  this.filteredCourses.sort((a,b)=>{
                return b.grade-a.grade
            })
            this.honorGradesBackup = [...this.filteredCourses]
            this.failGradesBackup = [...this.filteredCourses]
        },
        sortDescending(){
           this.filteredCourses =  this.filteredCourses.sort((a,b)=>{
                return a.grade-b.grade
            })
            this.honorGradesBackup = [...this.filteredCourses]
            this.failGradesBackup = [...this.filteredCourses]
        },
        honorGrades(state){
            if(state){
                this.filteredCourses =  this.filteredCourses.filter((el)=>{
                    return el.grade>=80
                })
            }else{
                if(this.honorGradesBackup.length>0){
                    this.filteredCourses =  [...this.honorGradesBackup]
                }else{
                    this.filteredCourses =  [...this.courses]
                }
            }
        },
        failGrades(state){
            if(state){
                this.filteredCourses =  this.filteredCourses.filter((el)=>{
                    return el.grade<=20
                })
            }else{
                if(this.failGradesBackup.length>0){
                    this.filteredCourses =  [...this.failGradesBackup]
                }else{
                    this.filteredCourses =  [...this.courses]
                }
            }
        },
        reset(){
            this.filteredCourses = [...this.courses]; 
            this.searchKey=''
            this.honorGradesOn=false,
            this.failGradesOn = false
        }
    },
    computed:{
        minimum(){
            if(this.courses.length>0){
                let min = this.courses[0].grade
                this.courses.forEach((el)=>{
                    if(el.grade < min){
                        min = el.grade
                    }
                })
                return min
            }else{
                return 0
            }
        },
        maximum(){
            if(this.courses.length>0){
                let max = this.courses[0].grade
                this.courses.forEach((el)=>{
                    if(el.grade > max){
                        max = el.grade
                    }
                })
                return max
            }else{
                return 0
            }
        },
        average(){
            if(this.courses.length>0){
                let sum = 0
                this.courses.forEach((el)=>{
                    sum += el.grade
                })
                return Math.floor(sum/this.courses.length)
            }else{
                return 0
            }
        }

    },
    mounted() {
        this.filteredCourses = [...this.courses]
    },
    template: `
    <div class="wrapper">
    <header>
        <div class="logo">
            <h1>Grade Analyzer</h1>
        </div>
        <div class="filters">
            <input type="text" placeholder="Search course name" v-model="searchKey" @input="searchCourse"/>
            <div class="flex">
                <h4>Honor Grades</h4>
                <div class="toggle" @click="honorGradesOn=!honorGradesOn; honorGrades(honorGradesOn)" :class="honorGradesOn?'toggleOn':''">
                    <div class="circle" :class="honorGradesOn?'circleOn':''"></div>
                </div>
            </div>
            <div class="flex">
                <h4>Fail Grades</h4>
                <div class="toggle" @click=" failGradesOn=! failGradesOn; failGrades(failGradesOn)" :class="failGradesOn?'toggleOn':''">
                    <div class="circle" :class="failGradesOn?'circleOn':''"></div>
                </div>
            </div>
            <div class="flex">
                <button class="arrow" @click="sortAsscending">↑</button>
                <button class="arrow" @click="sortDescending">↓</button>
            </div>
            <button @click="reset" class="reset">↺</button>
        </div>
    </header>
    <main>
        <h2 class="noData" v-if="filteredCourses.length===0">No Result Found</h2>
        <ul class="grades">
            <li v-for="(course, index) in filteredCourses" :key="index" class="grade-item">
                <div class="flex">
                    <p><b>Course</b> : {{course.name}}</p>            
                    <p><b>Grade</b> : {{course.grade}}</p>   
                </div>
                <div class="flex">
                    <button class="delete" @click="removeCourse(index)">Delete</button>
                    <button class="edit" @click="setupForEdit(index)">Edit</button>  
                </div>
            </li>    
        </ul>
            
        <div class="overlay" v-if="showCreatePopup || showEditPopup" @click="showCreatePopup=false; showEditPopup=false"></div>
        <div class="popup" v-if="showCreatePopup">
            <h3>Add new Course and Grade</h3>
            <form>
            <label for="courseName">Course : <input type="text" id="courseName" v-model="coursename" required></label>        
            <label for="grade">Grade : <input type="number" name="" id="" min="0" max="100" v-model="grade" required></label>        
            <div class="buttons">
                <button @click="showCreatePopup=false" class="createButton">Cancel</button>        
                <button @click="addToList({name:coursename, grade:grade})" class="createButton">Create</button>        
            </div>
            </form>
        </div>     

        <div class="popup" v-if="showEditPopup">
            <h3>Edit Course and Grade</h3>
            <form>
                <label for="courseName">Course <input type="text" id="courseName" v-model="coursename" required></label>        
                <label for="grade">Grade<input type="number" name="" id="" min="0" max="100" v-model="grade" required></label>        
                <div class="buttons">
                    <button @click="showEditPopup=false" class="createButton">Cancel</button>        
                    <button @click="updateCourse" class="createButton">Update</button>        
                </div>
            </form>
        </div>     
        <button @click="showCreatePopup=true" class="createButton">Create grades</button>
    </main>
    <footer>
        <div class="summary">
            <p>Minimum : {{minimum}}</p>
            <p>Maximum : {{maximum}}</p>
            <p>Average : {{average}}</p>
        </div>
    </footer>
    </div>
    ` 
 })

  app.mount("#app"); 