import type { Metadata } from "next"
import WeddingInvitationClient from "@/components/WeddingInvitationClient"

interface SearchParams {
  invite?: string
  g?: string
}

// Generate dynamic metadata for personalized invites
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const inviteParam = searchParams.invite
  const genderParam = searchParams.g
  
  if (inviteParam) {
    const decodedName = decodeURIComponent(inviteParam.replace(/\+/g, ' '))
    const capitalizedName = decodedName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
    
    const genderTitle = genderParam === 'a' ? 'Invitada' : genderParam === 'o' ? 'Invitado' : 'Invitado/a'
    const genderGreeting = genderParam === 'a' ? 'invitada' : genderParam === 'o' ? 'invitado' : 'invitado/a'
    
    return {
      title: `${capitalizedName} - ${genderTitle} a la Boda de Leowander & Sarah`,
      description: `${capitalizedName}, estás ${genderGreeting} a celebrar el amor de Leowander & Sarah el 29 de Noviembre, 2025 en Santiago, República Dominicana`,
      openGraph: {
        title: `${capitalizedName} - ${genderTitle} a la Boda de Leowander & Sarah`,
        description: `${capitalizedName}, estás ${genderGreeting} a celebrar el amor de Leowander & Sarah el 29 de Noviembre, 2025 en Santiago, República Dominicana`,
        images: [
          {
            url: '/images/hero-couple.jpg',
            width: 1200,
            height: 630,
            alt: `Invitación personal para ${capitalizedName} - Boda Leowander & Sarah`,
          }
        ],
      },
      twitter: {
        title: `${capitalizedName} - ${genderTitle} a la Boda de Leowander & Sarah`,
        description: `${capitalizedName}, estás ${genderGreeting} a celebrar el amor de Leowander & Sarah el 29 de Noviembre, 2025`,
        images: ['/images/hero-couple.jpg'],
      },
    }
  }
  
  // Default metadata (fallback)
  return {
    title: "Leowander & Sarah - Invitación de Boda",
    description: "Nos complace invitarte a celebrar nuestro amor el 29 de Noviembre, 2025 en Santiago, República Dominicana",
  }
}

export default function WeddingInvitation() {
  return <WeddingInvitationClient />
}