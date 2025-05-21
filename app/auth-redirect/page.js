'use client'

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.isProfile) {
        router.push('/dash?login=oauth');
      } else {
        router.push('/dashboard?login=oauth');
      }
    }
    else{
        router.push('/')
    }
  }, [status, session, router]);

  return <p></p>;
}
