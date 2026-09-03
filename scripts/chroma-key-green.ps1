# Removes neon chromakey green and writes a real RGBA PNG.
# Gemini often saves JPEG bytes under a .png filename; System.Drawing reads both.
param(
  [Parameter(Mandatory = $true)]
  [string]$Path
)

Add-Type -AssemblyName System.Drawing

$full = (Resolve-Path -LiteralPath $Path).Path
$bytes = [System.IO.File]::ReadAllBytes($full)
$ms = New-Object System.IO.MemoryStream (, $bytes)
$src = [System.Drawing.Image]::FromStream($ms)
$bmp = New-Object System.Drawing.Bitmap $src.Width, $src.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.DrawImage($src, 0, 0, $src.Width, $src.Height)
$graphics.Dispose()
$src.Dispose()
$ms.Dispose()

$rect = New-Object System.Drawing.Rectangle 0, 0, $bmp.Width, $bmp.Height
$data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$ptr = $data.Scan0
$stride = $data.Stride
$buffer = New-Object byte[] ($stride * $bmp.Height)
[System.Runtime.InteropServices.Marshal]::Copy($ptr, $buffer, 0, $buffer.Length)

$keyed = 0
for ($y = 0; $y -lt $bmp.Height; $y++) {
  $row = $y * $stride
  for ($x = 0; $x -lt $bmp.Width; $x++) {
    $i = $row + ($x * 4)
    $b = [int]$buffer[$i]
    $g = [int]$buffer[$i + 1]
    $r = [int]$buffer[$i + 2]
    $a = [int]$buffer[$i + 3]
    $isGreen = ($g -ge 185) -and ($r -le 90) -and ($b -le 90) -and (($g - $r) -ge 70) -and (($g - $b) -ge 70)
    if (-not $isGreen) { continue }
    $closeness = [Math]::Min(1.0, [Math]::Max(0.0, (($g - [Math]::Max($r, $b) - 70) / 100.0)))
    $alpha = [int][Math]::Round($a * (1 - $closeness))
    if ($alpha -lt 40) {
      $buffer[$i] = 0
      $buffer[$i + 1] = 0
      $buffer[$i + 2] = 0
      $buffer[$i + 3] = 0
      $keyed++
    } else {
      $despill = [Math]::Min($g, 255 - $alpha)
      $ng = [Math]::Max($r, [Math]::Max($b, $g - [int][Math]::Round($despill * 0.65)))
      $buffer[$i + 1] = [byte]$ng
      $buffer[$i + 3] = [byte]$alpha
    }
  }
}

[System.Runtime.InteropServices.Marshal]::Copy($buffer, 0, $ptr, $buffer.Length)
$bmp.UnlockBits($data)
$label = "$(Split-Path $full -Leaf) $($bmp.Width)x$($bmp.Height) keyed=$keyed"
$bmp.Save($full, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "OK $label"
