__author__ = "Justin Ribeiro <justin@justinribeiro.com>"

class SecurityHeadersMixin:
    """Reusable mixin for setting security-related HTTP headers. Only took me
    seven years to break this out, and it's still A graded security-wise, go
    figure"""

    def _content_security_policy(self, jsnonce: str, stylenonce: str) -> str:
        """Return the Content Security Policy string."""
        return (
            "default-src 'none'; "
            "base-uri 'self'; "
            "worker-src 'self'; "
            f"script-src 'nonce-js-{jsnonce}' 'strict-dynamic'; "
            f"style-src 'self' 'nonce-css-{stylenonce}'; "
            "connect-src 'self' "
            "https://storage.googleapis.com "
            "https://www.google-analytics.com "
            "https://webmention.io/; "
            "img-src 'self' data: https://storage.googleapis.com https://i.ytimg.com; "
            "media-src 'self' https://storage.googleapis.com; "
            "form-action 'self' https://webmention.io; "
            "object-src 'none'; "
            "font-src 'self' https://storage.googleapis.com; "
            "frame-src https://www.youtube.com; "
            "manifest-src 'self'; "
            "frame-ancestors 'none';"
        )

    def _feature_policy(self) -> str:
        """Return the Feature Policy string."""
        return (
            "accelerometer 'none'; "
            "ambient-light-sensor 'self'; "
            "autoplay 'self' https://www.youtube.com; "
            "camera 'none'; "
            "fullscreen 'self' https://www.youtube.com; "
            "geolocation 'none'; "
            "gyroscope 'none'; "
            "magnetometer 'none'; "
            "microphone 'none'; "
            "midi 'none'; "
            "payment 'none'; "
            "picture-in-picture 'self' https://www.youtube.com; "
            "sync-xhr 'none'; "
            "usb 'none'; "
            "screen-wake-lock 'none';"
        )

    def _base_security_headers(self) -> dict[str, str]:
        """Return headers that don’t depend on runtime values."""
        return {
            "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "no-referrer, strict-origin-when-cross-origin",
            "Content-Security-Policy-Report-Only": "require-trusted-types-for 'script';",
        }

    def set_security_headers(self, jsnonce: str, stylenonce: str) -> None:
        """Attach all security headers to the response."""
        headers = self._base_security_headers()
        headers["Content-Security-Policy"] = self._content_security_policy(
            jsnonce, stylenonce
        )
        headers["Feature-Policy"] = self._feature_policy()

        for key, value in headers.items():
            self.response.headers[key] = value
