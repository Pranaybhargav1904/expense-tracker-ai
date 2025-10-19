import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { createUser } from '@/app/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    let { email, fullName } = body;

    // Trim whitespace from email
    email = email?.trim();
    fullName = fullName?.trim();

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    // Validate email format (more permissive regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: `Invalid email format. Please enter a valid email address.` },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Create auth user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: undefined, // Disable email confirmation for development
      },
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      // Return the exact error from Supabase
      return NextResponse.json(
        { error: `Signup failed: ${authError.message}` },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create user in our users table with the same ID as auth user
    try {
      await createUser({
        id: authData.user.id, // Use the auth user's ID
        name: fullName,
        email: email,
      });
    } catch (dbError) {
      console.error('Database error creating user in users table:', dbError);
      // Note: Auth user is already created, so we log but don't fail
      // The user can still login, but some features might not work until user is in DB
    }

    return NextResponse.json(
      {
        message: 'Signup successful! Please check your email to verify your account.',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          fullName: fullName,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup' },
      { status: 500 }
    );
  }
}

