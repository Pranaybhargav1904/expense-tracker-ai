import { NextRequest, NextResponse } from 'next/server';

// Test endpoint to debug email validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { email } = body;

    const results = {
      originalEmail: email,
      trimmedEmail: email?.trim(),
      emailRegexTest: false,
      validation: {
        hasEmail: !!email,
        afterTrim: !!email?.trim(),
        length: email?.length,
        trimmedLength: email?.trim()?.length,
      }
    };

    email = email?.trim();

    // Test the regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    results.emailRegexTest = emailRegex.test(email);

    return NextResponse.json(results);

  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed', details: error },
      { status: 500 }
    );
  }
}

