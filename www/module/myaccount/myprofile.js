app.controller('myprofile', function ($scope, $http, $location, $interval, $cookieStore, model, $locale, loading, $route) {


    // $scope.select_country = "INDIA";
    // return;
    $scope.maxDate = new Date();
    $scope.monthSelectorOptions = {
        format: "dd-MM-yyyy"
    }
    

    /* Upload adds link */

    $scope.upload_ad = function () {
        $location.path('/upload_ads');
    }

    $scope.my_account = function () {
        $location.path("myaccount/account");
    }

    /* End Upload adds link  Here*/

    /* Update Profile of advertiser Link Form */

    $scope.update_advertise_info = function () {
        $location.path('myaccount/advertise_up');
    }

    /* End Update Profile of advertiser Link Form */


    /* Change Password  for advertiser Link Form */

    $scope.changepassword_advertise = function () {
        $location.path('/changepassword');
    }
    /* get Profile data for perticular user id  */


    $scope.toAddress = function(){
        $location.path("/address/add");
    }


    //Function to fetch the User's Data

    $scope.myprofile_data = function () {
        loading.active();
        //console.log("Profile data initialize")

        var args = $.param({
            'user_id': $cookieStore.get("userinfo").uid,
            'language_code' :sessionStorage.lang_code
        });

        $http({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/basic_info',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
            // console.log(res.data.data);return;
            if (res.data.data.status == 'success') {
                console.log(res);
                //put cookie and redirect it    
                $scope.fname = res.data.data.basic_info.first_name;
                $scope.lname = res.data.data.basic_info.last_name;
                $scope.email = res.data.data.basic_info.email;
                $scope.mobile = res.data.data.basic_info.mobile_number;
                $scope.address = res.data.data.basic_info.address;
                $scope.country = res.data.data.basic_info.COUNTRY_NAME;
                $scope.countryID = res.data.data.address_details[0].country;
                $scope.city = res.data.data.basic_info.CITY_NAME;
                console.log($scope.country);
                $scope.image = res.data.data.basic_info.image;

               
            } else {

                //Throw error if not logged in
                model.show('Alert', res.data.responseMessage);
            }
        });

    }

    /*Update user profile */

    $scope.updateUserProfile = function (form) {
        var error_str = '';
        
        if ($scope[form].$error) {

            if ($scope[form].fname.$error.required !== undefined) {
                error_str += "First Name, ";
            }
            
            if ($scope[form].lname.$error.required !== undefined) {
                error_str += "Last Name, ";
            }

           /*  if ($scope[form].email.$error.required !== undefined || $scope[form].email.$error.email) {
                error_str += "Email Id, ";
            }
            if ($scope[form].mobile.$error.required !== undefined) {
                error_str += "Mobile Number, ";
            } */

            if ($scope[form].address.$error.required !== undefined) {
                error_str += "Address, ";
            }
            
            
            if ($scope[form].select_country.$error.required !== undefined) {
                error_str += "Country, ";
            }

            if ($scope[form].select_city.$error.required !== undefined) {
                error_str += "City, ";
            }
        }
        setTimeout(function () {
            error_str = error_str.substr(0, error_str.lastIndexOf(', '));
            if (error_str !== '') {
                error_str = " <span style='font-weight:700;'>Following fields must have valid information:</span></br>" + error_str;
                model.show('Alert', error_str);
                return false;
            }
        }, 400);
        if (error_str == '') {

            /* var reg1 = /[0-9]{2}[-|\/]{1}[0-9]{2}[-|\/]{1}[0-9]{4}/;

            if (reg1.test($scope.dob) == false) {
                error_str = "Date Format Is Wrong";
                // model.show('Alert', error_str);
                alert(error_str);
                return false;
            } */
            // console.log("-----------------aaaaaaaaaaa");
            // console.log($scope.select_city);
            loading.active();

            if($scope.select_city == undefined){
                model.show("Alert","<span style='font-weight:700;'>Following fields must have valid information:</span></br>City");
                return false;
            }
            var args = $.param({
                user_id: $cookieStore.get("userinfo").uid,
                first_name: $scope.fname,
                last_name: $scope.lname,
                address: $scope.address,
                country_id : $scope.select_country,
                city_id : $scope.select_city,
                language_code : sessionStorage.lang_code,
            });

            

            // alert(args);return;

            $http({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + '/edit_account',
                data: args //forms user object

            }).then(function (response) {
                loading.deactive();
                res = response;

                console.log("response from the server ");
                console.log(res);

                if (res.data.data.status == 'success') {
                   
                    //console.log("Profile updated")
                    var fname = response.data.data.user_account.first_name;
                    var lname = response.data.data.user_account.last_name;
    
                    var fullName = fname+" "+lname;
    
                    var fullName = {
                        'fullName' : fullName
                    }
                    $cookieStore.put("FullName",fullName);
                    model.show('Alert', 'Profile Updated Successfully');
                    $route.reload();
                    //$location.path('/dashboard/home');
                    
                } else {

                    //Throw error if not logged in

                    model.show('Alert', res.data.responseMessage);
                    $location.path('/dashboard/myprofile');
                }
            }).finally(function () {
                //loading.deactive();
            })
        }
    }


   


    //defualt country
    $scope.fetchcountry = function(){  
        loading.active();      
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded' //'multipart/form-data' 
            },
            method: 'POST',
            url: app_url + '/get_country',
            //data: args
        }).then(function (response) {  
            loading.deactive();
            console.log(response);
            res = response;   
            if (res.data.data.status == 'success') {
                $scope.Countries = res.data.data.country;   
                console.log($scope.Countries);             
            } else {    
                model.show('Alert', res.data.responseMessage);
                $location.path('/dashboard/myprofile');
            }
        }).finally(function () {
            loading.deactive();
        })
    }

    //default city
    $scope.fetchcity = function(){
        // alert($scope.select_country);
        loading.active();
        // $scope.Cities = "";
        var args = $.param({
            'country_id': $scope.select_country
           // 'file' : profile_image
        });
        
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded' //'multipart/form-data' 
            },
            method: 'POST',
            url: app_url + '/get_city',
            data: args
        }).then(function (response) {  
            loading.deactive();
            // console.log(response);

            res = response;   
            if (res.data.data.status == 'success') {
                // console.log(res.data.data.city);
                if(!res.data.data.city){
                    // console.log("in the false");return;
                    model.show('Alert','No Cities Found!');
                    $scope.Cities = "";
                    console.log($scope.Cities);
                    return false;
                }else{
                    $scope.Cities = res.data.data.city;   
                    console.log($scope.Cities); 
                }
            } else {    
                model.show('Alert', res.data.responseMessage);
                $location.path('/dashboard/myprofile');
            }
        }).finally(function () {
            loading.deactive();
        })
    }
});
