import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  imports: [CommonModule, RouterLink],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
  faqs: FAQ[] = [
    {
      question: 'How do I create an account?',
      answer:
        'To create an account, click on the "Sign Up" button in the top right corner of the homepage. Fill in your details including your full name, email address, and password. Make sure to use a strong password with at least 8 characters.',
      isOpen: false,
    },
    {
      question: 'How do I book movie tickets?',
      answer:
        'Browse our movie listings, select your preferred showtime, choose your seats, and complete the payment process. You will receive a confirmation email with your ticket details and QR code.',
      isOpen: false,
    },
    {
      question: 'Can I cancel or refund my ticket?',
      answer:
        'Tickets can be cancelled up to 2 hours before the showtime for a full refund. Go to your profile, navigate to "History", and click "Cancel" on your upcoming bookings.',
      isOpen: false,
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and digital wallets. All payments are processed securely through our encrypted payment gateway.',
      isOpen: false,
    },
    {
      question: 'How do I get to the cinema?',
      answer:
        'Each cinema location has detailed directions and parking information on our website. You can find this information on the cinema details page or in your booking confirmation.',
      isOpen: false,
    },
    {
      question: 'What should I do if I lose my ticket?',
      answer:
        'If you lose your physical ticket or QR code, you can retrieve it from your account under "History". Show your ID at the cinema entrance and they will assist you.',
      isOpen: false,
    },
    {
      question: 'Are there age restrictions for movies?',
      answer:
        'Yes, some movies have age ratings. Children under the specified age may not be admitted. Please check the movie details for age restrictions before booking.',
      isOpen: false,
    },
    {
      question: 'Can I change my seat selection after booking?',
      answer:
        'Seat changes can be made up to 1 hour before the showtime through your account. Additional fees may apply depending on the seat type change.',
      isOpen: false,
    },
    {
      question: 'Do you offer student or senior discounts?',
      answer:
        'Yes, we offer discounts for students and seniors. Present valid ID at the cinema or apply the discount code during online booking.',
      isOpen: false,
    },
    {
      question: 'What if the movie is sold out?',
      answer:
        'If a showtime is sold out, you can join the waitlist or check for other showtimes. We also send notifications when tickets become available.',
      isOpen: false,
    },
  ];

  toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
