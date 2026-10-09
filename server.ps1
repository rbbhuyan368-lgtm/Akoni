# Akaoni High-Performance TCP HTTP Web Server
param(
    [int]$Port = 3000,
    [string]$Root = "c:\Users\rbbhu\OneDrive\Documents\akaoni"
)

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
$listener.Start()
Write-Host "Akaoni Live Server listening on port $Port (All interfaces: 0.0.0.0:$Port)"

$mimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".htm"   = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".png"   = "image/png"
    ".webp"  = "image/webp"
    ".svg"   = "image/svg+xml"
    ".ico"   = "image/x-icon"
    ".mp4"   = "video/mp4"
    ".woff"  = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf"   = "font/ttf"
}

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $stream.ReadTimeout = 5000
        $stream.WriteTimeout = 5000

        $buffer = [byte[]]::new(16384)
        $bytesRead = $stream.Read($buffer, 0, $buffer.Length)
        if ($bytesRead -le 0) {
            $client.Close()
            continue
        }

        $requestStr = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $bytesRead)
        $firstLine = $requestStr.Split("`n")[0].Trim()
        $parts = $firstLine.Split(' ')

        if ($parts.Length -lt 2) {
            $client.Close()
            continue
        }

        $method = $parts[0].ToUpper()
        $rawPath = $parts[1]
        $cleanPath = $rawPath.Split('?')[0].TrimStart('/')
        $urlPath = [System.Uri]::UnescapeDataString($cleanPath)

        # CORS Preflight
        if ($method -eq "OPTIONS") {
            $header = "HTTP/1.1 204 No Content`r`nAccess-Control-Allow-Origin: *`r`nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`r`nAccess-Control-Allow-Headers: Content-Type, Authorization`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Flush()
            $client.Close()
            continue
        }

        # API: Save dishes
        if ($method -eq "POST" -and ($cleanPath -eq "api/dishes" -or $cleanPath -eq "api/dishes/")) {
            $contentLength = 0
            foreach ($line in $requestStr.Split("`n")) {
                if ($line.ToLower().StartsWith("content-length:")) {
                    $contentLength = [int]($line.Split(':')[1].Trim())
                }
            }

            # Locate start of body
            $headerEndIdx = $requestStr.IndexOf("`r`n`r`n")
            $headerLength = 0
            if ($headerEndIdx -ge 0) {
                $headerLength = $headerEndIdx + 4
            } else {
                $headerEndIdx = $requestStr.IndexOf("`n`n")
                if ($headerEndIdx -ge 0) { $headerLength = $headerEndIdx + 2 }
            }

            $bodyBytes = [System.Collections.Generic.List[byte]]::new()
            $bodyBytesAlreadyRead = $bytesRead - $headerLength
            if ($bodyBytesAlreadyRead -gt 0) {
                for ($i = $headerLength; $i -lt $bytesRead; $i++) {
                    $bodyBytes.Add($buffer[$i])
                }
            }

            while ($bodyBytes.Count -lt $contentLength) {
                $chunk = [byte[]]::new(16384)
                $read = $stream.Read($chunk, 0, $chunk.Length)
                if ($read -le 0) { break }
                for ($j = 0; $j -lt $read; $j++) {
                    $bodyBytes.Add($chunk[$j])
                }
            }

            $bodyStr = [System.Text.Encoding]::UTF8.GetString($bodyBytes.ToArray())
            $dishesPath = [System.IO.Path]::Combine($Root, "dishes.json")
            [System.IO.File]::WriteAllText($dishesPath, $bodyStr, [System.Text.Encoding]::UTF8)

            $respBody = [System.Text.Encoding]::UTF8.GetBytes('{"success":true,"message":"Dishes updated successfully"}')
            $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($respBody.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($respBody, 0, $respBody.Length)
            $stream.Flush()
            $client.Close()
            continue
        }

        # API: Save categories
        if ($method -eq "POST" -and ($cleanPath -eq "api/categories" -or $cleanPath -eq "api/categories/")) {
            $contentLength = 0
            foreach ($line in $requestStr.Split("`n")) {
                if ($line.ToLower().StartsWith("content-length:")) {
                    $contentLength = [int]($line.Split(':')[1].Trim())
                }
            }

            $headerEndIdx = $requestStr.IndexOf("`r`n`r`n")
            $headerLength = 0
            if ($headerEndIdx -ge 0) {
                $headerLength = $headerEndIdx + 4
            } else {
                $headerEndIdx = $requestStr.IndexOf("`n`n")
                if ($headerEndIdx -ge 0) { $headerLength = $headerEndIdx + 2 }
            }

            $bodyBytes = [System.Collections.Generic.List[byte]]::new()
            $bodyBytesAlreadyRead = $bytesRead - $headerLength
            if ($bodyBytesAlreadyRead -gt 0) {
                for ($i = $headerLength; $i -lt $bytesRead; $i++) {
                    $bodyBytes.Add($buffer[$i])
                }
            }

            while ($bodyBytes.Count -lt $contentLength) {
                $chunk = [byte[]]::new(16384)
                $read = $stream.Read($chunk, 0, $chunk.Length)
                if ($read -le 0) { break }
                for ($j = 0; $j -lt $read; $j++) {
                    $bodyBytes.Add($chunk[$j])
                }
            }

            $bodyStr = [System.Text.Encoding]::UTF8.GetString($bodyBytes.ToArray())
            $catsPath = [System.IO.Path]::Combine($Root, "categories.json")
            [System.IO.File]::WriteAllText($catsPath, $bodyStr, [System.Text.Encoding]::UTF8)

            $respBody = [System.Text.Encoding]::UTF8.GetBytes('{"success":true,"message":"Categories updated successfully"}')
            $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($respBody.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($respBody, 0, $respBody.Length)
            $stream.Flush()
            $client.Close()
            continue
        }

        # API: Get categories
        if ($method -eq "GET" -and ($cleanPath -eq "api/categories" -or $cleanPath -eq "api/categories/")) {
            $catsPath = [System.IO.Path]::Combine($Root, "categories.json")
            if ([System.IO.File]::Exists($catsPath)) {
                $bytes = [System.IO.File]::ReadAllBytes($catsPath)
                $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)
                $stream.Write($bytes, 0, $bytes.Length)
                $stream.Flush()
                $client.Close()
                continue
            }
        }

        if ([string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "index.html"
        }

        $filePath = [System.IO.Path]::Combine($Root, $urlPath.Replace('/', '\'))
        if (-not [System.IO.File]::Exists($filePath) -and [System.IO.File]::Exists($filePath + ".html")) {
            $filePath = $filePath + ".html"
        }

        if ([System.IO.File]::Exists($filePath)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $ct = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $header = "HTTP/1.1 200 OK`r`nContent-Type: $ct`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($bytes, 0, $bytes.Length)
        } else {
            $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($body, 0, $body.Length)
        }
        $stream.Flush()
        $client.Close()
    } catch {
        # ignore socket resets
    }
}
