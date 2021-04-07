var app = angular.module('employeeApp', ['ngRoute','ui.bootstrap']);


//routing
app.config(['$routeProvider',function($routeProvider){
	
	$routeProvider
		.when('/employee',{
			templateUrl: 'views/employees/employee.html'
		})
		.when('/team', {
			templateUrl: 'views/teams/team.html',
			controller: 'teamCtr'
		})
		.when('/employee/detailinfo/:idemp',{
			templateUrl: 'views/employees/detailinfo.html',
			controller: 'detailInfoCtrl'
		})
//		.when('/employee/detailworking/:idemp',{
//			templateUrl: 'views/employees/detailworking.html',
//			controller: 'detailWorkingCtrl'
//		})
//		.when('/employee/detailadvance/:idemp',{
//			templateUrl: 'views/employees/detailadvance.html',
//			controller: 'detailAdvanceCtrl'
//		})
		.otherwise({
			redirectTo: '/employee'
		});
}]);

//controller employee
app.controller('employeeCtrl', function($scope, $http, $uibModal, $location) {
	$scope.employeeEntity = {
		     id:"",
			 name:"",
			 address:"", 
			 sex:"male",
			 startdate: new Date(),
			 age:20,
			 phone:"",
			 hour:4,
			 teamId:"",
			 isCheck: true
	};	
	
  $scope.showPopup = function(employee){
	  $scope.modalInstance = $uibModal.open({
		 arialabelledBy: 'modal-title', 
		 ariaDescribedBy: 'modal-body', 
		 templateUrl: 'views/employees/view.html', 
		 controller: 'ModelHandlerController',
		 controllerAs: 'ep', 
		 size: 'lg', 
		 resolve: {
			 data: function (){
				 return employee;
			 }
		 }
	  });
  }	
	
  $scope.employees = [];
  $scope.pageCurrent=1;
  _refreshEmployeeData(); 
  _countPageEmployee();
  //paging isSelected
  $scope.isSelected = function(section) {
      return $scope.pageCurrent === section+1;
  }
  //change page 
  $scope.clickChangePage = function(section){
	  $scope.pageCurrent=section;
	  _getUserPerPage(section,3);
  }
  // refreshEmployee
  function _refreshEmployeeData(){
      $http({
          method: 'GET', 
          url:'/users/pagination?page=1&size=3'
      }).then(
          function(res){
              $scope.employees=res.data; 
          }, 
          function(res){//error
              console.log("Error: "+res.status+": "+res.data);
          }
      )
  }
  //count page
  function _countPageEmployee(){
      $http({
          method: 'GET', 
          url:'/users/all'
      }).then(
          function(res){
        	  $scope.numPages = [];
              if(res.data.length%3==0){
            	  for(var i=0; i<res.data.length/3; i++){
            		  $scope.numPages.push(i);
            	  } 
              }else {
            	  for(var i=0; i<=res.data.length/3; i++){
            		  $scope.numPages.push(i);
            	  }
              }
          }, 
          function(res){//error
              console.log("Error: "+res.status+": "+res.data);
          }
      )
  }
  //get user per page 
  function _getUserPerPage(page,size){
	  $http({
          method: 'GET', 
          url:'/users/pagination?page='+page+'&size='+size
      }).then(
          function(res){
        	  $scope.employees=res.data;
          }, 
          function(res){
              console.log("Error: "+res.status+": "+res.data);
          }
      )
  }
  
  //delete 1 employee
  $scope.confirmActionDialogConfig = {};
  $scope.confirmActionDialog = function(employee) { 
	  
	  $scope.confirmActionDialogConfig={
		  buttons:[{
			  label: "Delete",
			  action:"delete",
			  data: employee
		  }]
	  };
	  $scope.showDialog(true);
   };
  
   $scope.executeDialogAction = function(action,data) {
	    if(typeof $scope[action] === "function") {
	    	$scope[action](data);
	    }
	 };
   
  $scope.delete = function(employee) {
	  
    $http({
	    method: 'DELETE',
	    url: '/users/deleteuser/' + employee.id
	}).then(
		 function (res){
			_refreshEmployeeData(); 
			_countPageEmployee();
		 },
		 function(res){
			  var data = res.data;
		      var status = res.status;
		      alert("Error: " + status + ":" + data);
		 }
	);
    $scope.showDialog();
  };
  
  $scope.showDialog = function(flag) {
    jQuery("#confirmation-dialog .modal").modal(flag ? 'show' : 'hide');
  };
  
  //========Delete 1 employee=====
  // delete multiple employee
  $scope.confirmDeleteMulti = function(employees){
	  $scope.numEmpDel = 0;
	  angular.forEach(employees, function(value, key){
		  if(value.isCheck){
			  $scope.numEmpDel++;
		  }
	  })
	  $scope.showDeleteMulti(true);
  }
  $scope.showDeleteMulti = function(flag) {
	    jQuery("#confirmation-deletemulti .modal").modal(flag ? 'show' : 'hide');
  };
  $scope.executeActionDeleteMulti = function(action,data) {
	    if(typeof $scope[action] === "function") {
	    	$scope[action](data);
	    }
  };
  $scope.deleteMulti = function(employees) {
	  angular.forEach(employees, function(value, key){
		 if(value.isCheck){
			 $http({
				    method: 'DELETE',
				    url: '/users/deleteuser/' + value.id
				}).then(
					 function (res){
						_refreshEmployeeData(); 
						  _countPageEmployee();
					 },
					 function(res){
						  var data = res.data;
					      var status = res.status;
					      alert("Error: " + status + ":" + data);
					 }
				);
		 }
		 
	  });
	  
	  $scope.showDeleteMulti();
  }
  //==================== 
  //==Search
  $scope.searchEmpl = {
	 keyword: ""
  }
  $scope.searchByName = async function(){
	  $scope.tmpEmps =[];
	  await $http({
          method: 'GET', 
          url:'/users/all'
      }).then(
          function(res){
        	  $scope.tmpEmps =res.data;     
          }, 
          function(res){//error
              console.log("Error: "+res.status+": "+res.data);
          }
      )
	  $scope.employeesearch =[];
	  if($scope.searchEmpl.keyword != ""){
		 
		  angular.forEach($scope.tmpEmps,function(value, key){
			  
			if(value.name.toUpperCase().includes($scope.searchEmpl.keyword.toUpperCase())){
				  $scope.employeesearch.push(value);
				  
			 }
		  });
		  $scope.employees=$scope.employeesearch;
	  }else {
		  _refreshEmployeeData();
		  $scope.employeesearch=$scope.employees;
		  $scope.employees=$scope.employeesearch;
	  }
  }
});


//controller add employee
app.controller("ModelHandlerController",function($scope,$uibModalInstance,$http,$window,data){
	
	_getListTeam();
	 $scope.employeeForm = data;	
	  $scope.listteamSl =[];
	  function _getListTeam(){
		  $http({
	          method: 'GET', 
	          url:'/teams/all'
	      }).then(
	          function(res){
	        	  $scope.listteamS =res.data;  
	          }, 
	          function(res){//error
	              console.log("Error: "+res.status+": "+res.data);
	          }
	      )
	  }
	  // add employee
	  $scope.submitEmployee= function(){
		  if($scope.formAddEmp.$valid){
			   var method = ""; 
			   var url="";
			   if($scope.employeeForm.id==""){
				   method = "POST"; 
				   url = 'users/adduser'; 
			   }
			   $http({
				   method: method,
				   url: url, 
				   data: angular.toJson($scope.employeeForm), 
				   headers: {
					   'Content-Type':'application/json'
				   }
			   }).then(
					   function(res){
						   _clearFormData();
						   $uibModalInstance.dismiss('close');
						   $window.location.reload();
					   },
					   function (res){
							  var data = res.data;
						      var status = res.status;
						      var header = res.header;
						      var config = res.config;
						      alt("Error:  " +res.status + ":" + res.data);
						      
					   }
				) 
			 
		  }else{
			  alert("Error: is not empty");
		  }
			  
	  }
	  
	  function _clearFormData(){
		  $scope.employeeForm = {
		     id:"",
			 name:"",
			 address:"", 
			 sex:"male",
			 startdate: new Date(),
			 age:18,
			 phone:"",
			 hour:3,
			 teamId:""
		  };	
	  }
	
	 $scope.cancelModal = function(){
		 $uibModalInstance.dismiss('close');
	 }
	 
});	

//controller detail info
app.controller("detailInfoCtrl", function($scope,$routeParams,$uibModal,$http,$location,$filter){
	
   _getDetailInfoEmp();
   _getEmpForEdit();
   $scope.isShowInfo = true;
   $scope.isShowWorking = false;
   $scope.isShowAdvance = false;
   $scope.isShowStatis = false;
   $scope.idparam= $routeParams.idemp;
   $scope.workEntity={
	    id:"",
		userId: $routeParams.idemp,
		date: new Date(), 
		hour: 8
   }
   $scope.numMonth = [1,2,3,4,5,6,7,8,9,10,11,12];
   $scope.numYear = [2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032];
   $scope.statis={
	   month:1,
	   year:2020
   }
   //change menu click detail 
   $scope.clickInfo = function(){
	   $scope.isShowInfo = true;
	   $scope.isShowWorking = false;
	   $scope.isShowAdvance = false;
	   $scope.isShowStatis = false;
	   _getDetailInfoEmp();
	   
   }
   $scope.clickWorking = function(){
	   $scope.isShowInfo = false;
	   $scope.isShowWorking = true;
	   $scope.isShowAdvance = false;
	   $scope.isShowStatis = false;
	   //
		$scope.workingEmp = {};
		_getDetailWorkingEmp();
	   
   }
   $scope.clickAdvance = function(){
	   $scope.isShowInfo = false;
	   $scope.isShowWorking = false;
	   $scope.isShowAdvance = true;
	   $scope.isShowStatis = false;
	   $scope.advanceEmp = {};
	   _getDetailAdvanceEmp();
   }
   
   $scope.clickStatis =function (){
	   $scope.isShowInfo = false;
	   $scope.isShowWorking = false;
	   $scope.isShowAdvance = false;
	   $scope.isShowStatis = true;
	   
   }
   
  //detail info Employee
  $scope.inforemployee={};
  function _getDetailInfoEmp(){
	  $http({
          method: 'GET', 
          url:'/users/'+$routeParams.idemp
      }).then(
          function(res){
        	  $scope.inforemployee =res.data;  
          }, 
          function(res){//error
              console.log("Error: "+res.status+": "+res.data);
          }
      )
  }
  //detail working
  function _getDetailWorkingEmp(){
		$http({
	          method: 'GET', 
	          url:'/users/'+$routeParams.idemp
	      }).then(
	          function(res){
	        	  $scope.workingEmp =res.data;  
	          }, 
	          function(res){//error
	              console.log("Error: "+res.status+": "+res.data);
	          }
	      )
	} 
  
  //detail advance
  function _getDetailAdvanceEmp(){
		$http({
	          method: 'GET', 
	          url:'/users/'+$routeParams.idemp
	      }).then(
	          function(res){
	        	  $scope.advanceEmp =res.data;  
	          }, 
	          function(res){//error
	              console.log("Error: "+res.status+": "+res.data);
	          }
	      )
	} 
  
  //get employee for edit
  $scope.emplEdit={};
  function _getEmpForEdit(){
	  $http({
          method: 'GET', 
          url:'/users/useredit/'+$routeParams.idemp
      }).then(
          function(res){
        	  $scope.emplEdit =res.data;  
        	  $scope.emplEdit.startdate=new Date($scope.emplEdit.startdate);
          }, 
          function(res){//error
              console.log("Error: "+res.status+": "+res.data);
          }
      )
  }
  
  //edit employee
  $scope.showEditPopup = function(employee){
	  $scope.modalInstance = $uibModal.open({
		 arialabelledBy: 'modal-title', 
		 ariaDescribedBy: 'modal-body', 
		 templateUrl: 'views/employees/edit.html', 
		 controller: 'ModelEditEmpController',
		 controllerAs: 'ep', 
		 size: 'lg', 
		 resolve: {
			 data: function (){
				 return employee;
			 }
		 }
	  });
  }	
  
   //add working 
   $scope.showPopupAddWork = function(work){
		  $scope.modalInstance = $uibModal.open({
			 arialabelledBy: 'modal-title', 
			 ariaDescribedBy: 'modal-body', 
			 templateUrl: 'views/employees/addwork.html', 
			 controller: 'ModelHandlerWorkController',
			 controllerAs: 'ep', 
			 size: 'lg', 
			 resolve: {
				 data: function (){
					 return work;
				 }
			 }
		  });
	  }	
	$scope.listStatis = [];
	$scope.listStatisPerMonth =[];
	$scope.searchStatis = async function (){
		$scope.listStatisPerMonth =[];
		await $http({
	          method: 'GET', 
	          url:'/works/'+$routeParams.idemp
	      }).then(
	          function(res){
	        	 $scope.listStatis=res.data;  
	        	 angular.forEach($scope.listStatis, function(value, key){
	     			
	     			value.date = new Date(value.date);
	     			console.log(value.date.getMonth());
	     			if(value.date.getMonth() == Number($scope.statis.month ) && value.date.getFullYear()== Number($scope.statis.year)){
	     				$scope.listStatisPerMonth.push(value);
	     			}
	     			
	     		})
	          }, 
	          function(res){//error
	              console.log("Error: "+res.status+": "+res.data);
	          }
	      );
		 
	}
});
/*
//controller detail working
app.controller("detailWorkingCtrl", function($scope,$routeParams,$http,$location,$uibModal){
	_getDetailWorkingEmp();
	$scope.idparam= $routeParams.idemp;
	$scope.workingEmp = {};
	function _getDetailWorkingEmp(){
		$http({
	          method: 'GET', 
	          url:'/users/'+$routeParams.idemp
	      }).then(
	          function(res){
	        	  $scope.workingEmp =res.data;  
	          }, 
	          function(res){//error
	              console.log("Error: "+res.status+": "+res.data);
	          }
	      )
	} 
	
});
//controller detai advance
app.controller("detailAdvanceCtrl", function($scope,$routeParams,$http,$location){
	
	_getDetailAdvanceEmp();
	
	$scope.idparam= $routeParams.idemp;
	$scope.advanceEmp = {};
	function _getDetailAdvanceEmp(){
		$http({
	          method: 'GET', 
	          url:'/users/'+$routeParams.idemp
	      }).then(
	          function(res){
	        	  $scope.advanceEmp =res.data;  
	          }, 
	          function(res){//error
	              console.log("Error: "+res.status+": "+res.data);
	          }
	      )
	} 
	
});
*/
//team Ctroller
app.controller("teamCtr", function($scope,$routeParams,$http,$location,$uibModal){
	_getListTeam();
	$scope.listteam =[]; 
	$scope.teamDetail={};
	$scope.teamentity={
		id:"",
		name:""
	}
	//get all team
	function _getListTeam(){
		$http({
	          method: 'GET', 
	          url:'/teams/all'
	      }).then(
	          function(res){
	        	  $scope.listteam =res.data;  
	          }, 
	          function(res){//error
	              console.log("Error: "+res.status+": "+res.data);
	          }
	      )
	} 
	
	//get team by id
	$scope.detailTeam = function(idteam){
		$http({
	          method: 'GET', 
	          url:'/teams/'+idteam
	      }).then(
	          function(res){
	        	  $scope.teamDetail=res.data;  
	          }, 
	          function(res){//error
	              console.log("Error: "+res.status+": "+res.data);
	          }
	      )
	}
	
	//add team 
	$scope.showPopupAddTeam = function(team){
		  $scope.modalInstance = $uibModal.open({
			 arialabelledBy: 'modal-title', 
			 ariaDescribedBy: 'modal-body', 
			 templateUrl: 'views/teams/add.html', 
			 controller: 'ModelHandlerTeamController',
			 controllerAs: 'ep', 
			 size: 'lg', 
			 resolve: {
				 data: function (){
					 return team;
				 }
			 }
		  });
	  }	
	
});

//controller edit
app.controller("ModelEditEmpController", function($scope,$uibModalInstance,$http,$window,data){
	
	_getListTeam();
	 $scope.employeeForm = data;	
	  $scope.listteamSl =[];
	  function _getListTeam(){
		  $http({
	          method: 'GET', 
	          url:'/teams/all'
	      }).then(
	          function(res){
	        	  $scope.listteamS =res.data;  
	          }, 
	          function(res){//error
	              console.log("Error: "+res.status+": "+res.data);
	          }
	      )
	  }
	
	$scope.submitEditEmployee=function(){
		$http({
			method: 'PUT',
			url: '/users/updateuser/'+$scope.employeeForm.id,
			data: angular.toJson($scope.employeeForm), 
			   headers: {
				   'Content-Type':'application/json'
			   }
	      }).then(
	          function(res){
	        	 
	        	  $uibModalInstance.dismiss('close');
	        	  $window.location.reload();
	          }, 
	          function(res){//error
	              console.log(res.data);
	          }
	      )
	}
	
	$scope.canceleditModal = function(){
		 $uibModalInstance.dismiss('close');
	 }
})

app.controller("ModelHandlerTeamController", function($scope,$uibModalInstance,data,$http,$window){
	
	$scope.teamForm =data;
	$scope.submitTeam = function(){
		$http({
			method: 'POST',
			url: '/teams/addteam',
			data: angular.toJson($scope.teamForm), 
			   headers: {
				   'Content-Type':'application/json'
			   }
	      }).then(
	          function(res){
	        	  $uibModalInstance.dismiss('close');
	        	  $window.location.reload();
	          }, 
	          function(res){//error
	              console.log(res.data);
	          }
	      )
	} 
	$scope.cancelTeamModal = function(){
		 $uibModalInstance.dismiss('close');
	 }
})

app.controller("ModelHandlerWorkController", function($scope,$uibModalInstance,data,$http,$window){
	$scope.workform=data; 
	
	$scope.submitWorking = function (){
		
		$http({
			method: 'POST',
			url: '/works/addwork',
			data: angular.toJson($scope.workform), 
			   headers: {
				   'Content-Type':'application/json'
			   }
	      }).then(
	          function(res){
	        	  $uibModalInstance.dismiss('close');
	        	  $window.location.reload();
	          }, 
	          function(res){//error
	              console.log(res.data);
	          }
	      )
		
		
	}
	
	$scope.cancelWorkingModal = function (){
		$uibModalInstance.dismiss('close');
	}
	
})