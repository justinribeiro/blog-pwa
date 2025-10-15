__author__ = "Justin Ribeiro <justin@justinribeiro.com>"

import secrets
import logging
import webapp2
from lib.headers import SecurityHeadersMixin


class BaseHandler(SecurityHeadersMixin, webapp2.RequestHandler):
    """Base handler that sets security headers, nonces, and structured logging."""

    def dispatch(self):
        # Generate fresh nonces for every request, because spec and security
        self.stylenonce = secrets.token_hex(16)
        self.jsnonce = secrets.token_hex(16)

        # Set security headers before handling request
        self.set_security_headers(self.jsnonce, self.stylenonce)

        # Initialize logger, uses App Engine's env automatically
        self.logger = logging.getLogger(__name__)

        try:
            super().dispatch()
        except Exception as e:
            self.handle_exception(e, self.app.debug)

    def handle_exception(self, exception, debug):
        """Catch'em all! Well, unexpected errors and log them."""
        self.logger.exception(
            f"Unhandled exception on {self.request.path}: {exception}"
        )
        if debug:
            super().handle_exception(exception, debug)
        else:
            self.response.set_status(500)
            self.response.write("Internal server error")
