// Booking System Logic (Refined for Jan Samvad)

document.addEventListener('DOMContentLoaded', () => {
    initBookingSystem();
});

// Global function for UI toggle
window.toggleComplaintField = function (show) {
    const field = document.getElementById('complaintField');
    if (field) {
        field.style.display = show ? 'block' : 'none';
        const textarea = field.querySelector('textarea');
        if (textarea) textarea.required = show;
    }
}

function initBookingSystem() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const currentMonthEl = document.getElementById('currentMonth');
    const bookingForm = document.getElementById('bookingForm');
    const bookingModal = document.getElementById('bookingModal');
    const selectedDateInput = document.getElementById('selectedDate');
    const timeSlotSelect = document.getElementById('timeSlot');

    if (!calendarGrid) return;

    let currentDate = new Date();
    let selectedDate = null;

    // Store bookings structure: 
    // "YYYY-MM-DD": [ { name, phone, type, agenda, timeSlot, timestamp } ]
    const committedBookings = JSON.parse(localStorage.getItem('gsp_bookings_v2')) || {};
    const MAX_SLOTS = 10;

    // Inject Admin Controls if not present
    if (!document.getElementById('adminControls')) {
        const container = document.querySelector('.booking-info');
        if (container) {
            const adminDiv = document.createElement('div');
            adminDiv.id = 'adminControls';
            adminDiv.style.marginTop = '2rem';
            adminDiv.style.paddingTop = '1rem';
            adminDiv.style.borderTop = '1px solid #eee';
            adminDiv.innerHTML = `
                <h4 style="margin-bottom:0.5rem; color: #666;">Admin Actions</h4>
                <button id="printAgendaBtn" class="btn btn-secondary" style="font-size:0.8rem; padding: 0.5rem 1rem;">
                    🖨️ Print Today's Agenda
                </button>
            `;
            container.appendChild(adminDiv);

            document.getElementById('printAgendaBtn').addEventListener('click', printAgenda);
        }
    }

    // "Check Next Available Slot" Button Logic
    const bookNextBtn = document.getElementById('bookNextSlotBtn');
    if (bookNextBtn) {
        bookNextBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Find first available future date
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let foundDateStr = null;
            let slots = 0;

            // Simple robust check: look through the rendered days or data
            // Since we render the current month, let's look for the first day element that has slots
            // But better: calculating it independently to not rely on DOM rendering state if possible
            // For now, let's iterate days of this month from today onwards

            for (let day = 1; day <= daysInMonth; day++) {
                const checkDate = new Date(year, month, day);
                if (checkDate < today) continue;

                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const bookingsCount = committedBookings[dateStr] ? committedBookings[dateStr].length : 0;

                if (bookingsCount < MAX_SLOTS) {
                    foundDateStr = dateStr;
                    slots = MAX_SLOTS - bookingsCount;
                    break;
                }
            }

            if (foundDateStr) {
                openBookingModal(foundDateStr, slots);
            } else {
                alert("No slots available in the current month. Please check next month.");
            }
        });
    }

    function renderCalendar() {
        calendarGrid.innerHTML = '';

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        currentMonthEl.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Find next meeting date for "Next Meeting" display
        let nextMeetingDate = null;

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            const checkDate = new Date(year, month, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const bookingsCount = committedBookings[dateStr] ? committedBookings[dateStr].length : 0;
            const slotsLeft = MAX_SLOTS - bookingsCount;

            if (checkDate < today) {
                dayEl.classList.add('past');
            } else {
                // If it's a valid future date
                if (!nextMeetingDate && slotsLeft > 0) nextMeetingDate = checkDate;

                dayEl.addEventListener('click', () => {
                    if (slotsLeft > 0) openBookingModal(dateStr, slotsLeft);
                });

                // Add indicator dots
                if (bookingsCount > 0) {
                    const dots = document.createElement('div');
                    dots.style.fontSize = '8px';
                    dots.style.color = 'var(--color-saffron)';
                    dots.textContent = '•'.repeat(Math.min(bookingsCount, 3));
                    dayEl.appendChild(dots);
                }
            }

            if (slotsLeft <= 0) {
                dayEl.classList.add('full');
                dayEl.title = "Fully Booked";
            } else {
                dayEl.title = `${slotsLeft} slots available`;
            }

            calendarGrid.appendChild(dayEl);
        }

        // Update a "Next Meeting" text if we wanted to
    }

    function openBookingModal(dateStr, slotsLeft) {
        selectedDate = dateStr;
        selectedDateInput.value = dateStr;

        // Reset form
        bookingForm.reset();
        window.toggleComplaintField(false);

        updateAvailableSlots(dateStr);

        bookingModal.style.display = 'flex';
        bookingModal.querySelector('.modal-content').classList.add('slide-in-up');
    }

    function updateAvailableSlots(dateStr) {
        timeSlotSelect.innerHTML = '<option value="">Select a Time Slot</option>';

        // Simplified slots for Jan Samvad
        const allSlots = [
            "10:00 AM - 11:00 AM",
            "11:00 AM - 12:00 PM",
            "12:00 PM - 01:00 PM",
            "03:00 PM - 04:00 PM",
            "04:00 PM - 05:00 PM"
        ];

        // In this logic, we don't block time slots, we just count total attendees per day
        allSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = slot;
            timeSlotSelect.appendChild(option);
        });
    }

    // Close Modal Logic
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => bookingModal.style.display = 'none');
    });

    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) bookingModal.style.display = 'none';
    });

    // Form Submit
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());

            // Manual Validation for Time Slot
            if (!data.timeSlot || data.timeSlot === "") {
                alert("Please select a valid time slot.");
                return;
            }

            // Add metadata
            data.timestamp = new Date().toISOString();

            if (!committedBookings[data.date]) {
                committedBookings[data.date] = [];
            }

            // Double check limit
            if (committedBookings[data.date].length >= MAX_SLOTS) {
                alert("Sorry, this date just got fully booked!");
                return;
            }

            committedBookings[data.date].push(data);
            localStorage.setItem('gsp_bookings_v2', JSON.stringify(committedBookings));

            bookingModal.style.display = 'none';
            renderCalendar();

            // WHATSAPP INTEGRATION
            console.log('Booking confirmed:', data);
            sendWhatsAppNotification(data);
        });
    }

    function sendWhatsAppNotification(data) {
        // Format message
        const typeStr = data.attendeeType === 'complaint' ? 'Complaint/Agenda' : 'General Visit';
        let msg = `*Jan Samvad Booking Confirmed!* ✅%0A%0A`;
        msg += `Dear *${data.name}*,%0A`;
        msg += `Your meeting with MP Gajendra Singh Patel is confirmed.%0A%0A`;
        msg += `📅 Date: ${data.date}%0A`;
        msg += `⏰ Time: ${data.timeSlot}%0A`;
        msg += `📋 Type: ${typeStr}%0A`;

        if (data.agenda) {
            msg += `📝 Agenda: ${data.agenda.substring(0, 50)}...%0A`;
        }

        msg += `%0A⚠️ *Important:* Please bring your valid ID card.`;

        // Open WhatsApp Web/App
        // Using a dummy number (or user's own number if we could) but wa.me link requires a target phone
        // Here we simulate by opening a window to 'self' or a confirmation page

        const confirmResult = confirm(`Booking Saved!\n\nSimulating WhatsApp Message:\n------------------\n${decodeURIComponent(msg).replace(/%0A/g, '\n')}\n------------------\n\nClick OK to open WhatsApp Web simulation.`);

        if (confirmResult) {
            // Opening wa.me with pre-filled text. In real app, this would go to the user's number via API
            // For demo: verify the formatting 
            window.open(`https://wa.me/?text=${msg}`, '_blank');
        }
    }

    // Admin Print Agenda
    function printAgenda() {
        // For demo, print "Tomorrow" or selected date if we tracked it differently
        // Let's print the most populated upcoming day
        const dates = Object.keys(committedBookings).sort();
        const nextDate = dates.find(d => new Date(d) >= new Date().setHours(0, 0, 0, 0)) || dates[dates.length - 1];

        if (!nextDate) {
            alert("No upcoming bookings to print.");
            return;
        }

        const bookings = committedBookings[nextDate];

        let printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Jan Samvad Agenda</title>');
        printWindow.document.write('<style>body{font-family: sans-serif; padding: 20px;} table{width:100%; border-collapse:collapse;} th,td{border:1px solid #ddd; padding:8px; text-align:left;} th{background:#f2f2f2;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<h1>Jan Samvad Agenda</h1>`);
        printWindow.document.write(`<h3>Date: ${nextDate} | Total Attendees: ${bookings.length}</h3>`);
        printWindow.document.write(`<table><thead><tr><th>#</th><th>Time</th><th>Name</th><th>Type</th><th>Phone</th><th>Agenda/Complaint</th></tr></thead><tbody>`);

        bookings.forEach((b, index) => {
            printWindow.document.write(`<tr>
                <td>${index + 1}</td>
                <td>${b.timeSlot}</td>
                <td>${b.name}</td>
                <td>${b.attendeeType === 'complaint' ? '🔴 Complaint' : '🟢 General'}</td>
                <td>${b.phone}</td>
                <td>${b.agenda || 'N/A'}</td>
            </tr>`);
        });

        printWindow.document.write('</tbody></table>');
        printWindow.document.write('<div style="margin-top:2rem;"><em>Auto-generated via GSP Website 10 mins before meeting.</em></div>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        // printWindow.print(); // Auto print
    }

    // Month Navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
}
