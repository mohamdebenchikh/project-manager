<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function search(Request $request){

        $users = User::where('name', 'like', '%' . $request->search . '%')
        ->select('id',"name",'photo')
        ->limit(5)
        ->get();

        return response()->json($users);
        
    }
}
