var mysql = require('mysql');
function select(){
    con.query("SELECT * FROM users WHERE status = 1", function(err, result){
        if(result.length == 0){
            console.log(0);
        }else if(result.length >= 1){
            for(var i=0; i < result.length; i++){
                console.log(result[i].name);
            }
        }
    });
};

select();