Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem -Recurse "public/images/story" -Filter "plato-*.png"
foreach ($f in $files) {
  $bmp = [System.Drawing.Bitmap]::FromFile($f.FullName)
  $c00 = $bmp.GetPixel(2, 2)
  $mid = $bmp.GetPixel([int]($bmp.Width / 2), [int]($bmp.Height / 2))
  $opaque = 0
  $sample = 0
  for ($y = 0; $y -lt $bmp.Height; $y += 24) {
    for ($x = 0; $x -lt $bmp.Width; $x += 24) {
      $sample++
      if ($bmp.GetPixel($x, $y).A -gt 250) { $opaque++ }
    }
  }
  $pct = [math]::Round(100.0 * $opaque / $sample, 1)
  Write-Output ("{0} {1}x{2} cornerA={3} RGB={4},{5},{6} midA={7} opaque~{8}%" -f $f.Name, $bmp.Width, $bmp.Height, $c00.A, $c00.R, $c00.G, $c00.B, $mid.A, $pct)
  $bmp.Dispose()
}
