const Sequelize = require('sequelize');

var sequelize = new Sequelize('haxvpezf', 'haxvpezf', 'qMedsimNXr1eCrnfFmOz68D4df8xS4Em', {
    host: 'lallah.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});



var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            resolve("Successfully connected to the database!");
        }).catch(function () {
            reject("unable to sync the database");
        });

    });

}

module.exports.getAllStudents = function () {
    return new Promise(function (resolve, reject) {
        Student.findAll().then(function (data) {
            resolve(data);
        }).catch(function () {
            reject("no results returned");
        });
    });

}

module.exports.getCourses = function () {
    return new Promise(function (resolve, reject) {
        Course.findAll().then(function (data) {
            resolve(data); return;
        }).catch(function () {
            reject("no results returned");
        });
    });

};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                studentNum: num
            }
        }).then(function () {
            resolve("Successfully get student by num!"); return;
        }).catch(function () {
            reject("no results returned");
        });
    });

};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                course: course
            }
        }).then(function () {
            resolve("Successfully get student by course!"); return;
        }).catch(function () {
            reject("no results returned");
        });
    });

};

module.exports.getCourseById = function (id) {
    return new Promise(function (resolve, reject) {
        Course.findAll({
            where: {
                courseId: id
            }
        }).then(function () {
            resolve("Successfully get course by id!"); return;
        }).catch(function () {
            reject("no results returned");
        });
    });

};

module.exports.addStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        studentData.TA = (studentData.TA) ? true : false;
        for (const prob in studentData) {
            if (prob === "") {
                prob = null;
            }
        }
        Student.create({
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            addressStreet: studentData.addressStreet,
            addressCity: studentData.addressCity,
            addressProvince: studentData.addressProvince,
            status: studentData.status
        }).then(function () {
            resolve("Successfully add student!");
        }).catch(function () {
            reject("unable to create student");
        });

    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        studentData.TA = (studentData.TA) ? true : false;
        for (const prob in studentData) {
            if (prob === "") {
                prob = null;
            }
        }
        Student.update({
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            addressStreet: studentData.addressStreet,
            addressCity: studentData.addressCity,
            addressProvince: studentData.addressProvince,
            status: studentData.status
        }, {
            where: { studentNum: studentData.studentNum }
        }
        ).then(function () {
            resolve("Successfully update student!");
        }).catch(function () {
            reject("unable to update student");
        });
    });

};

module.exports.addCourse = function (courseData) {
    return new Promise(function (resolve, reject) {
        for (const prob in courseData) {
            if (prob === "") {
                prob = null;
            }
        }
        Course.create({
            courseCode: courseData.courseCode,
            courseDescription: courseData.courseDescription
        }).then(function () {
            resolve("Successfully add course!"); return;
        }).catch(function () {
            reject("unable to create course");
        });

    });
};
module.exports.updateCourse = function (courseData) {
    return new Promise(function (resolve, reject) {
        for (const prob in courseData) {
            if (prob === "") {
                prob = null;
            }
        }
        Course.update({
            courseCode: courseData.courseCode,
            courseDescription: courseData.courseDescription
        }, {
            where: { courseId: courseData.courseId }
        }).then(function () {
            resolve("Successfully update course!"); return;
        }).catch(function () {
            reject("unable to update course");
        });
    });
};

module.exports.deleteCourseById= function(id){
    return new Promise(function (resolve, reject) {
        Course.destroy({
            where: { courseId: id }
        }).then(function(){
            resolve("destroyed");
        }).catch(function () {
            reject("unable to delete course");
        });
    });
}
module.exports.deleteStudentByNum = function (studentNum){
    return new Promise(function (resolve, reject) {
        Student.destroy({
            where: { studentNum: studentNum }
        }).then(function(){
            resolve("destroyed");
        }).catch(function () {
            reject("unable to delete student");
        });
    });
}


