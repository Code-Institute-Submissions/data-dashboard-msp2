function sendMail(contactForm) {
    emailjs.send("gmail", "data_dashboard_ala", {
            "from_name": contactForm.name.value,
            "from_email": contactForm.email.value,
            "subject": contactForm.subject.value,
            "message": contactForm.message.value
        })
        .then(
            function(response) {
                console.log("SUCCESS", response);

            },
            function(error) {
                console.log("FAILED", error);
            }
        )
    return false // To block from loading a new page

}
