import mongoose from "mongoose";

const MenuScriptSchema = new mongoose.Schema({
    author_first_name : {type : String, required : true, trim : true},
    author_last_name : {type : String, required : true, trim : true},
    author_email : {type : String, required : true, trim : true},
    author_alt_email  :{type : String, required : true, trim : true},
    author_phone : {type : String, required : true, trim : true},
    author_region : {type : String, required : true, trim : true},
    menu_script_title : {type : String, required : true, trim : true},
    article_type : {type :String, required : true, trim : true},
    issued_type : {type : String, required : true, trim : true},
    special_issue_title : {type : String, required : true, trim : true},
    classification : {type : String, required : true, trim : true},
    suggest_classification : {type : String, required : true, trim : true},
    abstract : {type : String, required : true, trim : true},
    key_words : {type : [String], required : true},
    attachement : [{type : String, required : true}]
}, {timestamps : true})

export default mongoose.model("MenuScript", MenuScriptSchema);